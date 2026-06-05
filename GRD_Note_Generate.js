import { workflow, node, trigger, merge, newCredential } from '@n8n/workflow-sdk';

const SS = '19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y';
const gsCred = newCredential('Google Sheets account');

const start = trigger({
  type: 'n8n-nodes-base.manualTrigger', version: 1,
  config: { name: 'Start', position: [0, 192] }
});

const config = node({
  type: 'n8n-nodes-base.set', version: 3.4,
  config: {
    name: 'Config', position: [224, 192],
    parameters: {
      mode: 'raw',
      jsonOutput: JSON.stringify({
        spreadsheetId: SS,
        customerNotesTab: 'Customer Notes',
        jhTableId: '4CdagVdK1MZvofM5',
        prTableId: 'Ncw03CMuHVt9o7fE'
      })
    }
  }
});

const readCustomerNotes = node({
  type: 'n8n-nodes-base.googleSheets', version: 4.7,
  config: {
    name: 'Read Customer Notes', position: [448, 0],
    credentials: { googleSheetsOAuth2Api: gsCred },
    parameters: {
      resource: 'sheet', operation: 'read',
      documentId: { __rl: true, mode: 'id', value: SS },
      sheetName: { __rl: true, mode: 'name', value: 'Customer Notes' },
      options: { returnAllMatches: 'returnAllMatches' }
    },
    executeOnce: true
  }
});

const readStgJobHistory = node({
  type: 'n8n-nodes-base.dataTable', version: 1.1,
  config: {
    name: 'Read Stg Job History', position: [448, 192],
    parameters: {
      resource: 'row', operation: 'get',
      dataTableId: { __rl: true, mode: 'id', value: '4CdagVdK1MZvofM5' },
      returnAll: true
    },
    executeOnce: true
  }
});

const readStgProspects = node({
  type: 'n8n-nodes-base.dataTable', version: 1.1,
  config: {
    name: 'Read Stg Prospects', position: [448, 384],
    parameters: {
      resource: 'row', operation: 'get',
      dataTableId: { __rl: true, mode: 'id', value: 'Ncw03CMuHVt9o7fE' },
      returnAll: true
    },
    executeOnce: true
  }
});

const allMerge = merge({
  version: 3.2,
  config: { name: 'Merge All', parameters: { mode: 'append', numberInputs: 3 } }
});

const generateNotes = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Generate Notes', position: [896, 192],
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: "const items = $input.all();\nconst customers = [];\nconst jhRows = [];\nconst prRows = [];\nfor (const item of items) {\n  const j = item.json;\n  if (j.ServiceM8_UUID && j.Customer_Name) { customers.push(j); }\n  else if (j.Job_Date || j.Customer_Name || j.Invoice_Number) { jhRows.push(j); }\n  else if (j.Prospect_Name) { prRows.push(j); }\n}\nfunction formatDate(d) {\n  if (!d) return '';\n  const p = d.split(/[\\/\\-]/);\n  if (p.length === 3) {\n    let day = parseInt(p[0], 10), m = parseInt(p[1], 10), y = parseInt(p[2], 10);\n    if (y < 100) y += 2000;\n    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];\n    return day + ' ' + months[m - 1] + ' ' + y;\n  }\n  return d;\n}\nfunction formatCurrency(v) {\n  if (!v) return '';\n  const n = parseFloat(String(v).replace(/[$,]/g, ''));\n  if (isNaN(n)) return String(v).trim();\n  return '$' + n.toFixed(2).replace(/(\\d)(?=(\\d{3})+(?!\\d))/g, '$1,');\n}\nfunction padRight(s, n) {\n  s = String(s || '');\n  return s.length >= n ? s.substring(0, n) : s + ' '.repeat(n - s.length);\n}\nconst results = [];\nfor (const c of customers) {\n  const name = (c.Customer_Name || '').trim();\n  if (!name) continue;\n  const nameLower = name.toLowerCase();\n  const myJH = jhRows.filter(function(r) { return (r.Customer_Name || '').trim().toLowerCase() === nameLower; });\n  const myPR = prRows.filter(function(r) { return (r.Prospect_Name || '').trim().toLowerCase() === nameLower; });\n  const noteParts = [];\n  if (myJH.length > 0) {\n    noteParts.push('--- Job History (' + myJH.length + ' records) ---');\n    for (const r of myJH) {\n      noteParts.push(padRight(formatDate(r.Job_Date), 14) + ' ' + padRight((r.Job_Type || '').substring(0, 18), 20) + ' ' + (r.Job_Details || '').substring(0, 50) + '  ' + padRight(formatCurrency(r.Price || r.Each || ''), 12) + '  ' + (r.Invoice_Number ? 'Inv: ' + r.Invoice_Number : ''));\n    }\n    noteParts.push('');\n  }\n  if (myPR.length > 0) {\n    noteParts.push('--- Quotes / Estimates (' + myPR.length + ' records) ---');\n    for (const r of myPR) {\n      const d = r.Date_Added ? formatDate(r.Date_Added) : '';\n      noteParts.push(padRight(d, 14) + ' ' + padRight((r.Status || '').substring(0, 14), 16) + ' ' + (r.Estimate_Information || '').substring(0, 70) + '  ' + formatCurrency(r.Price || r.Each || ''));\n    }\n    noteParts.push('');\n  }\n  results.push({ json: { Customer_Name: name, ServiceM8_UUID: c.ServiceM8_UUID, Source_Table: c.Source_Table, Note_Content: noteParts.join('\\n').trim(), Approval_Status: 'Pending' } });\n}\nreturn results;"
    }
  }
});

const clearTab = node({
  type: 'n8n-nodes-base.googleSheets', version: 4.7,
  config: {
    name: 'Clear Customer Notes', position: [1120, 192],
    credentials: { googleSheetsOAuth2Api: gsCred },
    parameters: {
      resource: 'sheet', operation: 'clear',
      documentId: { __rl: true, mode: 'id', value: SS },
      sheetName: { __rl: true, mode: 'name', value: 'Customer Notes' },
      clear: 'wholeSheet', keepFirstRow: true
    },
    executeOnce: true
  }
});

const appendTab = node({
  type: 'n8n-nodes-base.googleSheets', version: 4.7,
  config: {
    name: 'Append to Customer Notes', position: [1344, 192],
    credentials: { googleSheetsOAuth2Api: gsCred },
    parameters: {
      resource: 'sheet', operation: 'append',
      documentId: { __rl: true, mode: 'id', value: SS },
      sheetName: { __rl: true, mode: 'name', value: 'Customer Notes' },
      columns: { mappingMode: 'autoMapInputData', value: {} },
      options: { useAppend: true }
    }
  }
});

export default workflow('GRD_Note_Generate', 'Generate consolidated Note text per matched customer from Postgres data tables')
  .add(start)
  .to(config)
  .to(readCustomerNotes.to(allMerge.input(0)))
  .add(config)
  .to(readStgJobHistory.to(allMerge.input(1)))
  .add(config)
  .to(readStgProspects.to(allMerge.input(2)))
  .add(allMerge)
  .to(generateNotes)
  .to(clearTab)
  .to(appendTab);
