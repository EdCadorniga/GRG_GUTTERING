import { workflow, node, trigger, expr, newCredential } from '@n8n/workflow-sdk';

const SS = '19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y';
const SHEET = 'CustomerSitesForCleanup';
const gsCred = { id: 'SnkZZEvybquPKY8P', name: 'Google Sheets account' };
const sm8Cred = { oAuth2Api: newCredential('GRD GUTTERING APP') };
const BATCH_450 = { batch: { batchSize: 1, batchInterval: 450 } };

const every10Min = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: { name: 'Every 10 min', position: [0, 0] },
  output: [{}]
});

const readCleanupSheet = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Read Cleanup Sheet',
    position: [250, 0],
    executeOnce: true,
    parameters: {
      resource: 'sheet',
      operation: 'read',
      documentId: { __rl: true, mode: 'id', value: SS },
      sheetName: { __rl: true, mode: 'name', value: SHEET },
      options: { returnAllMatches: 'returnAllMatches' }
    },
    credentials: { googleSheetsOAuth2Api: gsCred }
  },
  output: [{
    Customer_Name: 'John Smith',
    Customer_UUID: 'abc-123',
    Site_Name: 'John Smith - Home',
    Site_Address: '12 Smith St',
    Site_UUID: 'sm8-uuid-here',
    Approval_Status: ''
  }]
});

const markSingleSiteCustomers = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Mark Single-Site Customers',
    position: [500, 0],
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: [
"var items = $input.all().map(function(item) {",
"  return item.json || {};",
"});",
"",
"var activeRows = items.filter(function(row) {",
"  var status = String(row.Approval_Status || '').trim().toLowerCase();",
"  return status !== 'deleted';",
"});",
"",
"var counts = new Map();",
"for (var i = 0; i < activeRows.length; i++) {",
"  var name = String(activeRows[i].Customer_Name || '').trim().toLowerCase();",
"  if (name) {",
"    counts.set(name, (counts.get(name) || 0) + 1);",
"  }",
"}",
"",
"var result = [];",
"for (var i = 0; i < items.length; i++) {",
"  var row = items[i];",
"  var name = String(row.Customer_Name || '').trim().toLowerCase();",
"  var status = String(row.Approval_Status || '').trim().toLowerCase();",
"  var isSingleSite = name && status !== 'delete' && status !== 'deleted' && counts.get(name) === 1;",
"",
"  var shouldDelete = isSingleSite || (status === 'delete' && counts.get(name) === 1);",
"  var newStatus;",
"  if (isSingleSite || (status === 'delete' && counts.get(name) === 1)) {",
"    newStatus = 'Delete';",
"  } else if (status === 'delete' && counts.get(name) > 1) {",
"    newStatus = '';",
"  } else {",
"    newStatus = String(row.Approval_Status || '').trim();",
"  }",
"",
"  result.push({",
"    json: {",
"      Customer_Name: String(row.Customer_Name || '').trim(),",
"      Customer_UUID: String(row.Customer_UUID || '').trim(),",
"      Site_Name: String(row.Site_Name || '').trim(),",
"      Site_Address: String(row.Site_Address || '').trim(),",
"      Site_Phone: String(row.Site_Phone || '').trim(),",
"      Site_UUID: String(row.Site_UUID || '').trim(),",
"      Approval_Status: newStatus,",
"      Review_Notes: String(row.Review_Notes || '').trim(),",
"      _batch_action: shouldDelete ? 'delete' : 'skip',",
"      _site_count: counts.get(name) || 0",
"    }",
"  });",
"}",
"",
"return result;"
      ].join('\n')
    }
  }
});

const updateSheetStatus = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Update Sheet Status',
    position: [750, 0],
    parameters: {
      resource: 'sheet',
      operation: 'appendOrUpdate',
      documentId: { __rl: true, mode: 'id', value: SS },
      sheetName: { __rl: true, mode: 'name', value: SHEET },
      columns: {
        mappingMode: 'defineBelow',
        value: {
          Customer_Name: expr('{{ $json.Customer_Name }}'),
          Customer_UUID: expr('{{ $json.Customer_UUID }}'),
          Site_Name: expr('{{ $json.Site_Name }}'),
          Site_Address: expr('{{ $json.Site_Address }}'),
          Site_Phone: expr('{{ $json.Site_Phone }}'),
          Approval_Status: expr('{{ $json.Approval_Status }}'),
          Review_Notes: expr('{{ $json.Review_Notes }}')
        },
        schema: [
          { id: 'Customer_Name', displayName: 'Customer_Name', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Customer_UUID', displayName: 'Customer_UUID', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Site_Name', displayName: 'Site_Name', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Site_Address', displayName: 'Site_Address', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Site_Phone', displayName: 'Site_Phone', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Approval_Status', displayName: 'Approval_Status', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Review_Notes', displayName: 'Review_Notes', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }
        ],
        matchingColumns: ['Customer_Name', 'Site_Address']
      },
      options: {
        handlingExtraData: 'insertInNewColumn'
      }
    },
    credentials: { googleSheetsOAuth2Api: gsCred }
  },
  output: [{
    Customer_Name: 'John Smith',
    Customer_UUID: 'abc-123',
    Site_Name: 'John Smith - Home',
    Site_Address: '12 Smith St',
    Approval_Status: 'Delete'
  }]
});

const prepareDeletions = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prepare Deletions',
    position: [1000, 0],
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: [
"var rows = $('Mark Single-Site Customers').all().map(function(item) {",
"  return item.json;",
"});",
"",
"var MAX_CUSTOMERS = 50;",
"var seen = new Map();",
"var deletions = [];",
"for (var i = 0; i < rows.length; i++) {",
"  var row = rows[i];",
"  var action = String(row._batch_action || '').trim();",
"  var siteUuid = String(row.Site_UUID || '').trim();",
"  if (action !== 'delete' || !siteUuid) { continue; }",
"  var name = String(row.Customer_Name || '').trim().toLowerCase();",
"  if (!seen.has(name)) { seen.set(name, seen.size); }",
"  if (seen.get(name) >= MAX_CUSTOMERS) { continue; }",
"  deletions.push({ json: { uuid: siteUuid, customer_name: String(row.Customer_Name || '').trim(), customer_uuid: String(row.Customer_UUID || '').trim(), site_address: String(row.Site_Address || '').trim(), site_name: String(row.Site_Name || '').trim() } });",
"}",
"return deletions;"
      ].join('\n')
    }
  }
});

const deleteSM8Site = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Delete SM8 Site',
    position: [1250, 0],
    parameters: {
      method: 'DELETE',
      url: expr('https://api.servicem8.com/api_1.0/company.json/{{ $json.uuid }}'),
      authentication: 'genericCredentialType',
      genericAuthType: 'oAuth2Api',
      options: { batching: BATCH_450 },
      response: { responseFormat: 'json', neverError: true }
    },
    credentials: sm8Cred
  },
  output: [{}]
});

const collectCustomerUUIDs = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Collect Customer UUIDs',
    position: [1500, 0],
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: [
"var items = $input.all().map(function(i) { return i.json; });",
"var seen = {};",
"var out = [];",
"for (var n = 0; n < items.length; n++) {",
"  var name = String(items[n].customer_name || '').trim();",
"  var uuid = String(items[n].customer_uuid || '').trim();",
"  if (name && uuid && !seen[name]) {",
"    seen[name] = true;",
"    out.push({ json: { customer_name: name, customer_uuid: uuid } });",
"  }",
"}",
"return out;"
      ].join('\n')
    }
  }
});

const fetchCustomerSites = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Fetch Customer Sites',
    position: [1750, 0],
    parameters: {
      method: 'GET',
      url: expr("https://api.servicem8.com/api_1.0/company.json?$filter=parent_company_uuid eq '{{ $json.customer_uuid }}' and active eq 1"),
      authentication: 'genericCredentialType',
      genericAuthType: 'oAuth2Api',
      options: { batching: BATCH_450 },
      response: { responseFormat: 'json', neverError: true }
    },
    credentials: sm8Cred
  },
  output: [{}]
});

const extractSiteUUIDs = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Extract Site UUIDs',
    position: [2000, 0],
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: [
"var rows = $input.all().map(function(i) { return i.json; });",
"var out = [];",
"for (var n = 0; n < rows.length; n++) {",
"  var data = rows[n];",
"  for (var k in data) {",
"    var site = data[k];",
"    if (site && typeof site === 'object' && site.uuid && String(site.active) === '1') {",
"      out.push({ json: { uuid: site.uuid } });",
"    }",
"  }",
"}",
"return out;"
      ].join('\n')
    }
  }
});

const deleteRemainingSites = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Delete Remaining Sites',
    position: [2250, 0],
    parameters: {
      method: 'DELETE',
      url: expr('https://api.servicem8.com/api_1.0/company.json/{{ $json.uuid }}'),
      authentication: 'genericCredentialType',
      genericAuthType: 'oAuth2Api',
      options: { batching: BATCH_450 },
      response: { responseFormat: 'json', neverError: true }
    },
    credentials: sm8Cred
  },
  output: [{}]
});

const markAsDeleted = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Mark As Deleted',
    position: [2500, 0],
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: [
"var rows = $('Prepare Deletions').all().map(function(item) {",
"  return item.json;",
"});",
"",
"var result = [];",
"for (var i = 0; i < rows.length; i++) {",
"  var row = rows[i];",
"  result.push({",
"    json: {",
"      Customer_Name: String(row.customer_name || '').trim(),",
"      Site_Address: String(row.site_address || '').trim(),",
"      Approval_Status: 'Deleted'",
"    }",
"  });",
"}",
"",
"return result;"
      ].join('\n')
    }
  }
});

const updateSheetAfterDelete = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Update Sheet After Delete',
    position: [2750, 0],
    parameters: {
      resource: 'sheet',
      operation: 'appendOrUpdate',
      documentId: { __rl: true, mode: 'id', value: SS },
      sheetName: { __rl: true, mode: 'name', value: SHEET },
      columns: {
        mappingMode: 'defineBelow',
        value: {
          Customer_Name: expr('{{ $json.Customer_Name }}'),
          Site_Address: expr('{{ $json.Site_Address }}'),
          Approval_Status: expr('{{ $json.Approval_Status }}')
        },
        schema: [
          { id: 'Customer_Name', displayName: 'Customer_Name', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Site_Address', displayName: 'Site_Address', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Approval_Status', displayName: 'Approval_Status', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }
        ],
        matchingColumns: ['Customer_Name', 'Site_Address']
      },
      options: {
        handlingExtraData: 'insertInNewColumn'
      }
    },
    credentials: { googleSheetsOAuth2Api: gsCred }
  },
  output: [{
    Customer_Name: 'John Smith',
    Site_Address: '12 Smith St',
    Approval_Status: 'Deleted'
  }]
});

export default workflow(
  'GRD_Cleanup_Single_Site_Customers',
  'Every 10 min: identifies single-site customers, deletes all SM8 sites (cap 50/run, 450ms interval), updates sheet.'
)
  .add(every10Min)
  .to(readCleanupSheet)
  .to(markSingleSiteCustomers)
  .to(updateSheetStatus)
  .to(prepareDeletions)
  .to(deleteSM8Site)
  .to(collectCustomerUUIDs)
  .to(fetchCustomerSites)
  .to(extractSiteUUIDs)
  .to(deleteRemainingSites)
  .to(markAsDeleted)
  .to(updateSheetAfterDelete);
