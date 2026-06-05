import { workflow, node, trigger, merge, expr, newCredential } from '@n8n/workflow-sdk';

const SS = '19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y';
const UPLOAD_LOG_TABLE_ID = '8tEfzXuwTSE793Xk';
const gsCred = { id: 'SnkZZEvybquPKY8P', name: 'Google Sheets account' };
const sm8Cred = newCredential('GRD GUTTERING APP');

const manualStart = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Manual Start', position: [0, 0] },
  output: [{}]
});

const scheduleStart = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: 'Every 5 Minutes',
    position: [0, 240],
    parameters: {
      rule: {
        interval: [{ field: 'minutes', minutesInterval: 5 }]
      }
    }
  },
  output: [{}]
});

const readCustomerNotes = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Read Customer Notes',
    position: [224, 0],
    credentials: { googleSheetsOAuth2Api: gsCred },
    parameters: {
      resource: 'sheet',
      operation: 'read',
      documentId: { __rl: true, mode: 'id', value: SS },
      sheetName: { __rl: true, mode: 'name', value: 'Customer Notes' },
      options: { returnAllMatches: 'returnAllMatches' }
    },
    executeOnce: true
  },
  output: [{
    Customer_Name: 'Example Customer',
    ServiceM8_UUID: '123e4567-e89b-12d3-a456-426614174000',
    Note_Content: 'Example note',
    Approval_Status: 'Approved',
    Source_Table: 'Job History'
  }]
});

const readUploadLog = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Read Upload Log',
    position: [224, 240],
    parameters: {
      resource: 'row',
      operation: 'get',
      dataTableId: { __rl: true, mode: 'id', value: UPLOAD_LOG_TABLE_ID },
      returnAll: true
    },
    executeOnce: true
  },
  output: [{
    serviceM8_uuid: '123e4567-e89b-12d3-a456-426614174000',
    customer_name: 'Example Customer',
    source_table: 'Job History',
    note_id: '7bf97d56-dba2-4f5d-9d4d-0f5cbe3c78a5',
    uploaded_at: '2026-06-02T10:46:06.850Z'
  }]
});

const prepareApprovedNotes = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prepare Approved Notes',
    position: [448, 0],
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: `
const items = $input.all();
const seen = new Set();
const pending = [];

for (const item of items) {
  const row = item.json || {};
  const approval = String(row.Approval_Status || row.approval_status || '').trim().toLowerCase();
  const uuid = String(row.ServiceM8_UUID || row.serviceM8_uuid || '').trim().toLowerCase();
  const note = String(row.Note_Content || row.note_content || '').trim();

  if (approval !== 'approved' || !uuid || !note) {
    continue;
  }

  // The first approved row for a company UUID wins within this run.
  if (seen.has(uuid)) {
    continue;
  }
  seen.add(uuid);

  pending.push({
    json: {
      _source: 'candidate',
      customer_name: String(row.Customer_Name || row.customer_name || '').trim(),
      serviceM8_uuid: uuid,
      note_content: note,
      source_table: String(row.Source_Table || row.source_table || '').trim(),
      approval_status: 'Approved'
    }
  });
}

return pending;
`
    }
  },
  output: [{
    _source: 'candidate',
    customer_name: 'Example Customer',
    serviceM8_uuid: '123e4567-e89b-12d3-a456-426614174000',
    note_content: 'Example note',
    source_table: 'Job History',
    approval_status: 'Approved'
  }]
});

const tagUploadLog = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Tag Upload Log',
    position: [448, 240],
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          { id: 'src', name: '_source', value: 'log', type: 'string' },
          { id: 'uuid', name: 'serviceM8_uuid', value: expr('{{ $json.serviceM8_uuid }}'), type: 'string' },
          { id: 'customer_name', name: 'customer_name', value: expr('{{ $json.customer_name }}'), type: 'string' },
          { id: 'source_table', name: 'source_table', value: expr('{{ $json.source_table }}'), type: 'string' },
          { id: 'note_id', name: 'note_id', value: expr('{{ $json.note_id }}'), type: 'string' },
          { id: 'uploaded_at', name: 'uploaded_at', value: expr('{{ $json.uploaded_at }}'), type: 'string' }
        ]
      }
    }
  },
  output: [{
    _source: 'log',
    serviceM8_uuid: '123e4567-e89b-12d3-a456-426614174000',
    customer_name: 'Example Customer',
    source_table: 'Job History',
    note_id: '7bf97d56-dba2-4f5d-9d4d-0f5cbe3c78a5',
    uploaded_at: '2026-06-02T10:46:06.850Z'
  }]
});

const mergeInputs = merge({
  version: 3.2,
  config: {
    name: 'Merge Inputs',
    position: [672, 120],
    parameters: {
      mode: 'append',
      numberInputs: 2
    }
  }
});

const buildUploadBatch = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Upload Batch',
    position: [896, 120],
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: `
const { randomUUID } = require('crypto');

const items = $input.all();
const uploaded = new Set();
const candidates = [];

for (const item of items) {
  const row = item.json || {};
  const source = String(row._source || '').trim().toLowerCase();

  if (source === 'log') {
    const uuid = String(row.serviceM8_uuid || '').trim().toLowerCase();
    if (uuid) {
      uploaded.add(uuid);
    }
    continue;
  }

  if (source === 'candidate') {
    candidates.push(row);
  }
}

const seen = new Set();
const batch = [];
const maxPerRun = 50;

for (const row of candidates) {
  const uuid = String(row.serviceM8_uuid || '').trim().toLowerCase();
  const note = String(row.note_content || '').trim();

  if (!uuid || !note || seen.has(uuid) || uploaded.has(uuid)) {
    continue;
  }

  seen.add(uuid);
  batch.push({
    json: {
      customer_name: String(row.customer_name || '').trim(),
      serviceM8_uuid: uuid,
      note_content: note,
      source_table: String(row.source_table || '').trim(),
      note_id: randomUUID()
    }
  });

  if (batch.length >= maxPerRun) {
    break;
  }
}

return batch;
`
    }
  },
  output: [{
    customer_name: 'Example Customer',
    serviceM8_uuid: '123e4567-e89b-12d3-a456-426614174000',
    note_content: 'Example note',
    source_table: 'Job History',
    note_id: '11111111-1111-4111-8111-111111111111'
  }]
});

const createSM8Note = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Create SM8 Note',
    position: [1120, 120],
    credentials: { oAuth2Api: sm8Cred },
    parameters: {
      method: 'POST',
      url: 'https://api.servicem8.com/api_1.0/note.json',
      authentication: 'genericCredentialType',
      genericAuthType: 'oAuth2Api',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'keypair',
      bodyParameters: {
        parameters: [
          { name: 'uuid', value: expr('{{ $json.note_id }}') },
          { name: 'related_object', value: 'company' },
          { name: 'related_object_uuid', value: expr('{{ $json.serviceM8_uuid }}') },
          { name: 'note', value: expr('{{ $json.note_content }}') }
        ]
      },
      options: {
        batching: {
          batch: {
            batchSize: 1,
            batchInterval: 350
          }
        },
        response: {
          responseFormat: 'json'
        }
      }
    }
  },
  output: [{
    errorCode: 0,
    message: 'OK'
  }]
});

const buildUploadLogRow = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Build Upload Log Row',
    position: [1344, 120],
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          { id: 'uuid', name: 'serviceM8_uuid', value: expr('{{ $("Build Upload Batch").item.json.serviceM8_uuid }}'), type: 'string' },
          { id: 'customer_name', name: 'customer_name', value: expr('{{ $("Build Upload Batch").item.json.customer_name }}'), type: 'string' },
          { id: 'source_table', name: 'source_table', value: expr('{{ $("Build Upload Batch").item.json.source_table }}'), type: 'string' },
          { id: 'note_id', name: 'note_id', value: expr('{{ $("Build Upload Batch").item.json.note_id }}'), type: 'string' },
          { id: 'uploaded_at', name: 'uploaded_at', value: expr('{{ $now.toISO() }}'), type: 'string' }
        ]
      }
    }
  },
  output: [{
    serviceM8_uuid: '123e4567-e89b-12d3-a456-426614174000',
    customer_name: 'Example Customer',
    source_table: 'Job History',
    note_id: '11111111-1111-4111-8111-111111111111',
    uploaded_at: '2026-06-02T10:46:06.850Z'
  }]
});

const upsertUploadLog = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Upsert Upload Log',
    position: [1568, 120],
    parameters: {
      resource: 'row',
      operation: 'upsert',
      dataTableId: { __rl: true, mode: 'id', value: UPLOAD_LOG_TABLE_ID, cachedResultName: 'grd_note_upload_log' },
      matchType: 'allConditions',
      filters: {
        conditions: [
          {
            keyName: 'serviceM8_uuid',
            condition: 'eq',
            keyValue: expr('{{ $json.serviceM8_uuid }}')
          }
        ]
      },
      columns: {
        mappingMode: 'autoMapInputData',
        value: {}
      }
    }
  },
  output: [{
    serviceM8_uuid: '123e4567-e89b-12d3-a456-426614174000',
    customer_name: 'Example Customer',
    source_table: 'Job History',
    note_id: '11111111-1111-4111-8111-111111111111',
    uploaded_at: '2026-06-02T10:46:06.850Z'
  }]
});

export default workflow(
  'GRD_Note_Upload_Batch',
  'Upload one approved note per company to ServiceM8 in 50-note runs, skipping UUIDs already in the upload log'
)
  .add(manualStart).to(readCustomerNotes)
  .add(manualStart).to(readUploadLog)
  .add(scheduleStart).to(readCustomerNotes)
  .add(scheduleStart).to(readUploadLog)
  .add(readCustomerNotes).to(prepareApprovedNotes)
  .add(readUploadLog).to(tagUploadLog)
  .add(prepareApprovedNotes).to(mergeInputs.input(0))
  .add(tagUploadLog).to(mergeInputs.input(1))
  .add(mergeInputs).to(buildUploadBatch)
  .add(buildUploadBatch).to(createSM8Note)
  .add(createSM8Note).to(buildUploadLogRow)
  .add(buildUploadLogRow).to(upsertUploadLog);
