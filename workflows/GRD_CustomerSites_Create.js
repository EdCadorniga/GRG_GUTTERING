import { workflow, node, trigger, merge, expr } from '@n8n/workflow-sdk';

const SS = '19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y';
const SM8_URL = 'https://api.servicem8.com/api_1.0/company.json';
const UPLOAD_LOG_TABLE = 'fT8PkvUENtmd69Qu';
const gsCred = { id: 'SnkZZEvybquPKY8P', name: 'Google Sheets account' };
const sm8Cred = { id: '9xTqnOrjPITTQoxc', name: 'GRD GUTTERING APP' };

const schedule = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: { name: 'Every 5 Minutes', parameters: { rule: { interval: [{ field: 'minutes' }] } } }
});

const manualStart = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Manual Start' }
});

const readSheet = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Read Customer Sites',
    credentials: { googleSheetsOAuth2Api: gsCred },
    parameters: {
      resource: 'sheet', operation: 'read',
      documentId: { __rl: true, mode: 'id', value: SS },
      sheetName: { __rl: true, mode: 'name', value: 'Customer Sites' },
      options: { returnAllMatches: 'returnAllMatches' }
    },
    executeOnce: true
  }
});

const prepareCandidates = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prepare Candidates',
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: `
const items = $input.all();
const seen = new Set();
const candidates = [];

for (const item of items) {
  const row = item.json || {};
  const approval = String(row.Approval_Status || '').trim().toLowerCase();
  const uuid = String(row.Customer_UUID || '').trim();
  const addr = String(row.Site_Address || '').trim();
  const name = String(row.Customer_Name || '').trim();

  if (approval !== 'approved' || !uuid || !addr) continue;

  const dedupKey = uuid.toLowerCase() + '|' + addr.toLowerCase();
  if (seen.has(dedupKey)) continue;
  seen.add(dedupKey);

  candidates.push({
    json: {
      _source: 'candidate',
      customer_name: name,
      customer_uuid: uuid,
      site_address: addr,
      site_name: String(row.Site_Name || addr).trim().substring(0, 100)
    }
  });
}

return candidates;
`
    }
  }
});

const readLog = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Read Upload Log',
    parameters: {
      resource: 'row', operation: 'get',
      dataTableId: { __rl: true, mode: 'id', value: UPLOAD_LOG_TABLE },
      returnAll: true
    },
    executeOnce: true
  }
});

const tagLog = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Tag Log Items',
    parameters: {
      mode: 'manual',
      includeOtherFields: true,
      assignments: {
        assignments: [
          { id: 'src', name: '_source', value: 'log', type: 'string' },
          { id: 'cuuid', name: 'customer_uuid', value: expr('{{ $json.customer_uuid }}'), type: 'string' },
          { id: 'saddr', name: 'site_address', value: expr('{{ $json.site_address }}'), type: 'string' }
        ]
      }
    }
  }
});

const mergeInputs = merge({
  version: 3.2,
  config: { name: 'Merge', parameters: { mode: 'append', numberInputs: 2 } }
});

const buildBatch = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Upload Batch',
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: `
const items = $input.all();
const uploaded = new Set();
const candidates = [];

for (const item of items) {
  const row = item.json || {};
  const src = String(row._source || '').trim().toLowerCase();

  if (src === 'log') {
    const cuuid = String(row.customer_uuid || '').trim().toLowerCase();
    const saddr = String(row.site_address || '').trim().toLowerCase();
    if (cuuid && saddr) uploaded.add(cuuid + '|' + saddr);
  } else if (src === 'candidate') {
    candidates.push(row);
  }
}

const seen = new Set();
const batch = [];
const maxPerRun = 50;

for (const row of candidates) {
  const cuuid = String(row.customer_uuid || '').trim().toLowerCase();
  const saddr = String(row.site_address || '').trim().toLowerCase();
  const key = cuuid + '|' + saddr;

  if (!cuuid || !saddr || seen.has(key) || uploaded.has(key)) continue;

  seen.add(key);
  batch.push({
    json: {
      customer_name: String(row.customer_name || '').trim(),
      customer_uuid: String(row.customer_uuid || '').trim(),
      site_address: String(row.site_address || '').trim(),
      site_name: String(row.site_name || '').trim()
    }
  });

  if (batch.length >= maxPerRun) break;
}

return batch;
`
    }
  }
});

const createSite = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Create Site in SM8',
    credentials: { oAuth2Api: sm8Cred },
    parameters: {
      method: 'POST',
      url: SM8_URL,
      authentication: 'genericCredentialType',
      genericAuthType: 'oAuth2Api',
      sendBody: true,
      bodyParameters: {
        parameters: [
          { name: 'name', value: expr('{{ $json.site_name }}') },
          { name: 'parent_company_uuid', value: expr('{{ $json.customer_uuid }}') },
          { name: 'address_street', value: expr('{{ $json.site_address }}') }
        ]
      },
      options: {
        batching: { batch: { batchSize: 1, batchInterval: 350 } },
        response: {}
      }
    }
  }
});

const buildLogRow = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Build Log Row',
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          { id: 'cname', name: 'customer_name', value: expr("{{ $('Build Upload Batch').item.json.customer_name }}"), type: 'string' },
          { id: 'cuuid', name: 'customer_uuid', value: expr("{{ $('Build Upload Batch').item.json.customer_uuid }}"), type: 'string' },
          { id: 'saddr', name: 'site_address', value: expr("{{ $('Build Upload Batch').item.json.site_address }}"), type: 'string' },
          { id: 'suuid', name: 'site_uuid', value: expr("{{ $response.headers['x-record-uuid'] }}"), type: 'string' },
          { id: 'ts', name: 'uploaded_at', value: expr('{{ $now.toISO() }}'), type: 'string' }
        ]
      }
    }
  }
});

const upsertLog = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Upsert Upload Log',
    parameters: {
      resource: 'row',
      operation: 'upsert',
      dataTableId: { __rl: true, mode: 'id', value: UPLOAD_LOG_TABLE },
      matchType: 'allConditions',
      filters: {
        conditions: [
          { keyName: 'customer_uuid', keyValue: expr('{{ $json.customer_uuid }}') },
          { keyName: 'site_address', keyValue: expr('{{ $json.site_address }}') }
        ]
      },
      columns: { mappingMode: 'autoMapInputData', value: {} },
      options: {}
    }
  }
});

export default workflow('GRD_CustomerSites_Create', 'Create approved customer sites in ServiceM8 with upload log guardrails')
  .add(schedule)
  .to(readSheet)
  .to(readLog)
  .add(manualStart)
  .to(readSheet)
  .to(readLog)
  .add(readSheet)
  .to(prepareCandidates)
  .to(mergeInputs.input(0))
  .add(readLog)
  .to(tagLog)
  .to(mergeInputs.input(1))
  .add(mergeInputs)
  .to(buildBatch)
  .to(createSite)
  .to(buildLogRow)
  .to(upsertLog);
