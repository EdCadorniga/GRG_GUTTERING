import { workflow, node, trigger } from '@n8n/workflow-sdk';

const SS = '19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y';
const gsCred = { id: 'SnkZZEvybquPKY8P', name: 'Google Sheets account' };

const start = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Start', position: [0, 192] }
});

const config = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Config',
    position: [224, 192],
    parameters: {
      mode: 'raw',
      jsonOutput: JSON.stringify({
        spreadsheetId: SS,
        notesTab: 'Customer Notes',
        batchSize: 200,
        delayMs: 350
      })
    }
  }
});

const readNotes = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Read Customer Notes',
    position: [448, 192],
    credentials: { googleSheetsOAuth2Api: gsCred },
    parameters: {
      resource: 'sheet',
      operation: 'read',
      documentId: { __rl: true, mode: 'id', value: SS },
      sheetName: { __rl: true, mode: 'name', value: 'Customer Notes' },
      options: { returnAllMatches: 'returnAllMatches' }
    },
    executeOnce: true
  }
});

const uploadNotes = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Upload Notes to SM8',
    position: [672, 192],
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: `
const items = $input.all();
const batchSize = $json.batchSize || 200;
const delayMs = $json.delayMs || 350;

// Only process Approved notes
var pending = [];
for (var i = 0; i < items.length; i++) {
  var item = items[i].json;
  if (item.Approval_Status === 'Approved' && item.ServiceM8_UUID && item.Note_Content) {
    pending.push(item);
  }
}

if (pending.length === 0) {
  return [{ json: { status: 'no_approved_notes', total: 0 } }];
}

const creds = await $credentials('GRD GUTTERING APP');
const token = creds.accessToken;

var uploaded = 0;
var failed = 0;
var errors = [];

for (var i = 0; i < pending.length; i++) {
  var note = pending[i];
  var body = {
    company_uuid: note.ServiceM8_UUID,
    note: note.Note_Content,
    author: 'GRD Historical Import'
  };
  try {
    await $http.post('https://api.servicem8.com/api/note.json', body, {
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
    });
    uploaded++;
  } catch (e) {
    failed++;
    errors.push({ customer: note.Customer_Name, uuid: note.ServiceM8_UUID, error: e.message });
  }
  // Rate limit: 180 req/min = 333ms between calls, use configured delay
  if (i < pending.length - 1) {
    await new Promise(function(resolve) { setTimeout(resolve, delayMs); });
  }
}

return [{
  json: {
    status: 'complete',
    total: pending.length,
    uploaded: uploaded,
    failed: failed,
    errors: errors.length > 0 ? JSON.stringify(errors) : ''
  }
}];
`
    }
  }
});

export default workflow('GRD_Note_Upload', 'Upload approved Notes from Customer Notes tab to ServiceM8 via /note.json with rate limiting')
  .add(start)
  .to(config)
  .to(readNotes)
  .to(uploadNotes);
