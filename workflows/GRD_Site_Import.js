import { workflow, node, trigger, merge, expr, newCredential } from '@n8n/workflow-sdk';

const manualStart = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Manual Start', position: [0, 0] },
  output: [{}]
});

const every10Min = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: 'Every 10 Minutes',
    position: [0, 300],
    parameters: {
      rule: {
        interval: [{ field: 'minutes', minutesInterval: 10 }]
      }
    }
  },
  output: [{}]
});
const readCustomerSites = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Read Customer Sites',
    position: [250, 50],
    executeOnce: true,
    parameters: {
      resource: 'sheet',
      operation: 'read',
      documentId: { __rl: true, mode: 'id', value: '19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y' },
      sheetName: { __rl: true, mode: 'name', value: 'Customer Sites' },
      options: { returnAllMatches: 'returnAllMatches' }
    }
  },
  output: [{
    Customer_Name: 'John Smith',
    Customer_UUID: 'abc-123',
    Site_Name: 'John Smith - Home',
    Site_Address: '12 Smith St, Springwood, QLD 4127',
    Site_Phone: "'+61 7 1234 5678",
    Approval_Status: 'Approved',
    Review_Notes: ''
  }]
});

const readUploadLog = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Read Upload Log',
    position: [250, 300],
    executeOnce: true,
    parameters: {
      resource: 'row',
      operation: 'get',
      dataTableId: { __rl: true, mode: 'id', value: 'fT8PkvUENtmd69Qu' },
      returnAll: true
    }
  },
  output: [{
    customer_name: 'John Smith',
    customer_uuid: 'abc-123',
    site_address: '12 Smith St, Springwood, QLD 4127',
    site_uuid: 'def-456',
    uploaded_at: '2026-06-09T12:00:00.000Z'
  }]
});
const prepareApprovedSites = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prepare Approved Sites',
    position: [500, 50],
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const items = $input.all();\nconst seen = new Set();\nconst pending = [];\n\nfor (const item of items) {\n  const row = item.json || {};\n  const approval = String(row.Approval_Status || row.approval_status || '').trim().toLowerCase();\n  const customerUuid = String(row.Customer_UUID || row.customer_uuid || '').trim();\n  const siteAddress = String(row.Site_Address || row.site_address || '').trim();\n  const siteName = String(row.Site_Name || row.site_name || '').trim();\n\n  if (approval !== 'approved' || !customerUuid || !siteAddress) {\n    continue;\n  }\n\n  const dedupKey = customerUuid + '|' + siteAddress.toLowerCase();\n  if (seen.has(dedupKey)) {\n    continue;\n  }\n  seen.add(dedupKey);\n\n  pending.push({\n    json: {\n      _source: 'candidate',\n      customer_name: String(row.Customer_Name || row.customer_name || '').trim(),\n      customer_uuid: customerUuid,\n      site_name: siteName || String(row.Customer_Name || row.customer_name || '').trim(),\n      site_address: siteAddress,\n      site_phone: String(row.Site_Phone || row.site_phone || '').trim(),\n      approval_status: 'Approved'\n    }\n  });\n}\n\nreturn pending;"
    }
  },
  output: [{
    json: {
      _source: 'candidate',
      customer_name: 'John Smith',
      customer_uuid: 'abc-123',
      site_name: 'John Smith - Home',
      site_address: '12 Smith St, Springwood, QLD 4127',
      site_phone: "'+61 7 1234 5678",
      approval_status: 'Approved'
    }
  }]
});

const tagUploadLog = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Tag Upload Log',
    position: [500, 300],
    parameters: {
      mode: 'manual',
      includeOtherFields: true,
      assignments: {
        assignments: [
          { id: '_source', name: '_source', value: 'log', type: 'string' }
        ]
      }
    }
  },
  output: [{
    _source: 'log',
    customer_name: 'John Smith',
    customer_uuid: 'abc-123',
    site_address: '12 Smith St, Springwood, QLD 4127',
    site_uuid: 'def-456',
    uploaded_at: '2026-06-09T12:00:00.000Z'
  }]
});

const mergeInputs = merge({
  version: 3.2,
  config: {
    name: 'Merge Inputs',
    position: [750, 150],
    parameters: { mode: 'append' }
  }
});

const buildUploadBatch = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Upload Batch',
    position: [1000, 150],
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const { randomUUID } = require('crypto');\nconst items = $input.all();\nconst uploaded = new Set();\nconst candidates = [];\nfor (const item of items) {\n  const row = item.json || {};\n  const source = String(row._source || '').trim().toLowerCase();\n  if (source === 'log') {\n    const key = (String(row.customer_uuid || '') + '|' + String(row.site_address || '')).toLowerCase();\n    if (key) {\n      uploaded.add(key);\n    }\n    continue;\n  }\n  if (source === 'candidate') {\n    candidates.push(row);\n  }\n}\nfunction parseAddress(raw) {\n  if (!raw) return { street: '', city: '', state: '', postcode: '' };\n  const parts = raw.split(',').map(s => s.trim()).filter(Boolean);\n  let street = '', city = '', state = '', postcode = '';\n  if (parts.length >= 3) {\n    const lastPart = parts[parts.length - 1];\n    const lastWords = lastPart.split(/\\s+/);\n    postcode = lastWords.pop() || '';\n    state = lastWords.join(' ');\n    city = parts[parts.length - 2];\n    street = parts.slice(0, -2).join(', ');\n  } else if (parts.length === 2) {\n    street = parts[0];\n    const lastWords = parts[1].split(/\\s+/);\n    postcode = lastWords.pop() || '';\n    state = lastWords.join(' ');\n    city = '';\n  } else {\n    street = parts[0];\n  }\n  return { street: street.trim(), city: city.trim(), state: state.trim(), postcode: postcode.trim() };\n}\nconst seen = new Set();\nconst batch = [];\nconst maxPerRun = 50;\nfor (const row of candidates) {\n  const customerUuid = String(row.customer_uuid || '').trim().toLowerCase();\n  const siteAddr = String(row.site_address || '').trim();\n  const dedupKey = customerUuid + '|' + siteAddr.toLowerCase();\n  if (!customerUuid || !siteAddr || seen.has(dedupKey) || uploaded.has(dedupKey)) {\n    continue;\n  }\n  seen.add(dedupKey);\n  const addr = parseAddress(siteAddr);\n  const siteUuid = randomUUID();\n  batch.push({\n    json: {\n      customer_name: String(row.customer_name || '').trim(),\n      customer_uuid: String(row.customer_uuid || '').trim(),\n      site_name: (String(row.site_name || '').trim() || String(row.customer_name || '').trim()).slice(0, 100),\n      site_address: siteAddr,\n      site_phone: String(row.site_phone || '').trim(),\n      site_uuid: siteUuid,\n      address_street: addr.street,\n      address_city: addr.city,\n      address_state: addr.state,\n      address_postcode: addr.postcode\n    }\n  });\n  if (batch.length >= maxPerRun) {\n    break;\n  }\n}\nreturn batch;"
    }
  },
  output: [{
    json: {
      customer_name: 'John Smith',
      customer_uuid: 'abc-123',
      site_name: 'John Smith - Home',
      site_address: '12 Smith St, Springwood, QLD 4127',
      site_phone: "'+61 7 1234 5678",
      site_uuid: 'generated-uuid-here',
      address_street: '12 Smith St',
      address_city: 'Springwood',
      address_state: 'QLD',
      address_postcode: '4127'
    }
  }]
});

const createSM8Site = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Create SM8 Site',
    position: [1250, 150],
    parameters: {
      method: 'POST',
      url: 'https://api.servicem8.com/api_1.0/company.json',
      authentication: 'genericCredentialType',
      genericAuthType: 'oAuth2Api',
      sendBody: true,
      bodyParameters: {
        parameters: [
          { name: 'uuid', value: expr('{{ $json.site_uuid }}') },
          { name: 'name', value: expr('{{ $json.site_name }}') },
          { name: 'parent_company_uuid', value: expr('{{ $json.customer_uuid }}') },
          { name: 'address_street', value: expr('{{ $json.address_street }}') },
          { name: 'address_city', value: expr('{{ $json.address_city }}') },
          { name: 'address_state', value: expr('{{ $json.address_state }}') },
          { name: 'address_postcode', value: expr('{{ $json.address_postcode }}') }
        ]
      },
      options: {
        batching: {
          batch: {
            batchSize: 1,
            batchInterval: 200
          }
        },
        response: {}
      }
    },
    credentials: {
      oAuth2Api: newCredential('GRD GUTTERING APP')
    }
  },
  output: [{}]
});

const buildUploadLogRow = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Build Upload Log Row',
    position: [1500, 150],
    parameters: {
      mode: 'manual',
      options: {},
      assignments: {
        assignments: [
          { id: 'customer_name', name: 'customer_name', value: expr('{{ $("Build Upload Batch").item.json.customer_name }}'), type: 'string' },
          { id: 'customer_uuid', name: 'customer_uuid', value: expr('{{ $("Build Upload Batch").item.json.customer_uuid }}'), type: 'string' },
          { id: 'site_address', name: 'site_address', value: expr('{{ $("Build Upload Batch").item.json.site_address }}'), type: 'string' },
          { id: 'site_uuid', name: 'site_uuid', value: expr('{{ $("Build Upload Batch").item.json.site_uuid }}'), type: 'string' },
          { id: 'uploaded_at', name: 'uploaded_at', value: expr('{{ $now.toISO() }}'), type: 'string' },
          { id: 'Customer_Name', name: 'Customer_Name', value: expr('{{ $("Build Upload Batch").item.json.customer_name }}'), type: 'string' },
          { id: 'Customer_UUID', name: 'Customer_UUID', value: expr('{{ $("Build Upload Batch").item.json.customer_uuid }}'), type: 'string' },
          { id: 'Site_Name', name: 'Site_Name', value: expr('{{ $("Build Upload Batch").item.json.site_name }}'), type: 'string' },
          { id: 'Site_Address', name: 'Site_Address', value: expr('{{ $("Build Upload Batch").item.json.site_address }}'), type: 'string' },
          { id: 'Site_Phone', name: 'Site_Phone', value: expr('{{ $("Build Upload Batch").item.json.site_phone }}'), type: 'string' },
          { id: 'Site_UUID', name: 'Site_UUID', value: expr('{{ $("Build Upload Batch").item.json.site_uuid }}'), type: 'string' },
          { id: 'Approval_Status', name: 'Approval_Status', value: 'Created', type: 'string' }
        ]
      }
    }
  },
  output: [{
    customer_name: 'John Smith',
    customer_uuid: 'abc-123',
    site_address: '12 Smith St, Springwood, QLD 4127',
    site_uuid: 'generated-uuid-here',
    uploaded_at: '2026-06-09T12:00:00.000Z',
    Customer_Name: 'John Smith',
    Customer_UUID: 'abc-123',
    Site_Name: 'John Smith - Home',
    Site_Address: '12 Smith St, Springwood, QLD 4127',
    Site_Phone: "'+61 7 1234 5678",
    Site_UUID: 'generated-uuid-here',
    Approval_Status: 'Created'
  }]
});

const upsertUploadLog = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Upsert Upload Log',
    position: [1750, 50],
    parameters: {
      resource: 'row',
      operation: 'upsert',
      dataTableId: { __rl: true, mode: 'id', value: 'fT8PkvUENtmd69Qu' },
      matchType: 'allConditions',
      filters: {
        conditions: [
          { keyName: 'customer_uuid', condition: 'eq', keyValue: expr('{{ $json.customer_uuid }}') },
          { keyName: 'site_address', condition: 'eq', keyValue: expr('{{ $json.site_address }}') }
        ]
      },
      columns: {
        mappingMode: 'autoMapInputData',
        value: {}
      },
      options: {}
    }
  },
  output: [{
    customer_name: 'John Smith',
    customer_uuid: 'abc-123',
    site_address: '12 Smith St, Springwood, QLD 4127',
    site_uuid: 'generated-uuid-here',
    uploaded_at: '2026-06-09T12:00:00.000Z'
  }]
});

const updateSheetStatus = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Update Sheet Status',
    position: [1750, 300],
    parameters: {
      resource: 'sheet',
      operation: 'appendOrUpdate',
      documentId: { __rl: true, mode: 'id', value: '19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y' },
      sheetName: { __rl: true, mode: 'name', value: 'Customer Sites' },
      columns: {
        mappingMode: 'autoMapInputData',
        value: {},
        matchingColumns: ['Customer_Name', 'Site_Address']
      },
      options: {
        handlingExtraData: 'insertInNewColumn'
      }
    },
    credentials: {
      googleSheetsOAuth2Api: newCredential('Google Sheets account')
    }
  },
  output: [{}]
});

export default workflow('GRD_Site_Import', 'Reads approved rows from Customer Sites Google Sheet, POSTs them to ServiceM8 as child company sites, logs to grd_site_upload_log, and updates sheet status. Manual + 10-minute schedule, 50/batch, 200ms API delay.')
  .add(manualStart)
  .to(readCustomerSites)
  .add(manualStart)
  .to(readUploadLog)
  .add(every10Min)
  .to(readCustomerSites)
  .add(every10Min)
  .to(readUploadLog)
  .add(readCustomerSites)
  .to(prepareApprovedSites.to(mergeInputs.input(0)))
  .add(readUploadLog)
  .to(tagUploadLog.to(mergeInputs.input(1)))
  .add(mergeInputs)
  .to(buildUploadBatch)
  .to(createSM8Site)
  .to(buildUploadLogRow)
  .to(upsertUploadLog)
  .add(buildUploadLogRow)
  .to(updateSheetStatus);
