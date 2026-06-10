import { workflow, node, trigger, merge, ifElse, newCredential } from '@n8n/workflow-sdk';

const SS = '19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y';
const gsCred = newCredential('Google Sheets account');

const start = trigger({
  type: 'n8n-nodes-base.manualTrigger', version: 1,
  config: { name: 'Start', position: [0, 300] }
});

const config = node({
  type: 'n8n-nodes-base.set', version: 3.4,
  config: {
    name: 'Config', position: [224, 300],
    parameters: {
      mode: 'raw',
      jsonOutput: JSON.stringify({
        spreadsheetId: SS,
        sm8UuidsTableId: 'zSTAdsGxNzi1a4or',
        jhTableId: '4CdagVdK1MZvofM5',
        prTableId: 'Ncw03CMuHVt9o7fE',
        customerNotesTab: 'Customer Notes',
        matchingExceptionsTab: 'Matching Exceptions'
      })
    }
  }
});

const readSm8Uuids = node({
  type: 'n8n-nodes-base.dataTable', version: 1.1,
  config: {
    name: 'Read SM8 UUIDs', position: [448, 100],
    parameters: {
      resource: 'row', operation: 'get',
      dataTableId: { __rl: true, mode: 'id', value: 'zSTAdsGxNzi1a4or' },
      returnAll: true
    },
    executeOnce: true
  }
});

const readStgJobHistory = node({
  type: 'n8n-nodes-base.dataTable', version: 1.1,
  config: {
    name: 'Read Stg Job History', position: [448, 300],
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
    name: 'Read Stg Prospects', position: [448, 500],
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
  config: { name: 'Merge All', parameters: { mode: 'append', numberInputs: 3 }, position: [672, 300] }
});

const matchingEngine = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Matching Engine', position: [896, 300],
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: "const normPhone = function(p) {\n  return (p || '').replace(/[^\\d]/g, '').replace(/^61/, '').replace(/^0/, '');\n};\nconst getBigrams = function(s) {\n  const r = [];\n  for (let i = 0; i < s.length - 1; i++) r.push(s.substring(i, i + 2));\n  return r;\n};\nconst diceScore = function(a, b) {\n  if (a === b) return 1;\n  if (a.length < 2 || b.length < 2) return 0;\n  const bgA = getBigrams(a);\n  const bgB = getBigrams(b);\n  const setB = new Set(bgB);\n  let inter = 0;\n  for (const bg of bgA) if (setB.has(bg)) inter++;\n  return (2 * inter) / (bgA.length + bgB.length);\n};\nconst items = $input.all();\nconst nameLookup = new Map();\nconst emailLookup = new Map();\nconst phoneLookup = new Map();\nconst sm8Names = [];\nconst nameItems = [];\nfor (const item of items) {\n  const j = item.json;\n  if (j.sm8_company_uuid) {\n    const nk = (j.customer_name || '').toLowerCase().trim();\n    if (nk) {\n      nameLookup.set(nk, { displayName: (j.customer_name || '').trim(), uuid: j.sm8_company_uuid, matchType: 'name' });\n      sm8Names.push({ key: nk, displayName: (j.customer_name || '').trim(), uuid: j.sm8_company_uuid });\n    }\n    const ek = (j.email || '').toLowerCase().trim();\n    if (ek && !emailLookup.has(ek)) emailLookup.set(ek, { displayName: (j.customer_name || '').trim(), uuid: j.sm8_company_uuid, matchType: 'email' });\n    const pk = normPhone(j.phone);\n    if (pk && !phoneLookup.has(pk)) phoneLookup.set(pk, { displayName: (j.customer_name || '').trim(), uuid: j.sm8_company_uuid, matchType: 'phone' });\n  } else if (j.Customer_Name) {\n    nameItems.push({ name: (j.Customer_Name || '').trim(), email: (j.Email || '').trim(), phone: normPhone(j.Home_Phone || j.Work_Phone || j.Mobile_Phone || ''), source: 'Job History' });\n  } else if (j.Prospect_Name) {\n    nameItems.push({ name: (j.Prospect_Name || '').trim(), email: (j.Email || '').trim(), phone: normPhone(j.Phone || j.Mobile || ''), source: 'Prospects' });\n  }\n}\nconst unique = new Map();\nfor (const e of nameItems) {\n  const k = e.name.toLowerCase();\n  if (!k) continue;\n  if (!unique.has(k)) unique.set(k, { displayName: e.name, email: e.email, phone: e.phone, sources: new Set() });\n  unique.get(k).sources.add(e.source);\n}\nconst results = [];\nfor (const [k, info] of unique) {\n  const src = Array.from(info.sources).join(', ');\n  let match = nameLookup.get(k);\n  if (!match && info.email) {\n    match = emailLookup.get(info.email.toLowerCase());\n  }\n  if (!match && info.phone) {\n    match = phoneLookup.get(info.phone);\n  }\n  if (!match) {\n    let bestScore = 0;\n    let bestMatch = null;\n    for (const sm8 of sm8Names) {\n      const score = diceScore(k, sm8.key);\n      if (score > bestScore) {\n        bestScore = score;\n        bestMatch = sm8;\n      }\n    }\n    if (bestScore >= 0.5) {\n      match = { displayName: bestMatch.displayName, uuid: bestMatch.uuid, matchType: 'fuzzy(' + bestScore.toFixed(2) + ')' };\n    }\n  }\n  if (match) {\n    results.push({ json: { Customer_Name: info.displayName, ServiceM8_UUID: match.uuid, Source_Table: src, Note_Content: '', Approval_Status: 'Pending', Review_Notes: '', _matchType: match.matchType, _matched: true } });\n  } else {\n    results.push({ json: { Source_Table: src, Record_Id: '', Customer_Name: info.displayName, Match_Field: 'Customer_Name', Match_Value: info.displayName, Issue_Description: 'No matching company found in ServiceM8', Resolved: 'No', Resolution_Notes: '', _matched: false } });\n  }\n}\nreturn results;"
    }
  }
});

const hasMatch = ifElse({
  version: 2.3,
  config: {
    name: 'Has Match?', position: [1120, 300],
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
        conditions: [{ leftValue: '={{ $json._matched }}', operator: { type: 'boolean', operation: 'equals' }, rightValue: true }],
        combinator: 'and'
      }
    }
  }
});

const clearCustomerNotes = node({
  type: 'n8n-nodes-base.googleSheets', version: 4.7,
  config: {
    name: 'Clear Customer Notes', position: [1344, 100],
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

const appendCustomerNotes = node({
  type: 'n8n-nodes-base.googleSheets', version: 4.7,
  config: {
    name: 'Append to Customer Notes', position: [1568, 100],
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

const clearMatchingExceptions = node({
  type: 'n8n-nodes-base.googleSheets', version: 4.7,
  config: {
    name: 'Clear Matching Exceptions', position: [1344, 500],
    credentials: { googleSheetsOAuth2Api: gsCred },
    parameters: {
      resource: 'sheet', operation: 'clear',
      documentId: { __rl: true, mode: 'id', value: SS },
      sheetName: { __rl: true, mode: 'name', value: 'Matching Exceptions' },
      clear: 'wholeSheet', keepFirstRow: true
    },
    executeOnce: true
  }
});

const appendMatchingExceptions = node({
  type: 'n8n-nodes-base.googleSheets', version: 4.7,
  config: {
    name: 'Append to Matching Exceptions', position: [1568, 500],
    credentials: { googleSheetsOAuth2Api: gsCred },
    parameters: {
      resource: 'sheet', operation: 'append',
      documentId: { __rl: true, mode: 'id', value: SS },
      sheetName: { __rl: true, mode: 'name', value: 'Matching Exceptions' },
      columns: { mappingMode: 'autoMapInputData', value: {} },
      options: { useAppend: true }
    }
  }
});

export default workflow('GRD_Match_CSV_to_SM8', 'Match CSV customers to SM8 UUIDs from Postgres data tables, populate Customer Notes and Matching Exceptions tabs')
  .add(start)
  .to(config)
  .to(readSm8Uuids.to(allMerge.input(0)))
  .add(config)
  .to(readStgJobHistory.to(allMerge.input(1)))
  .add(config)
  .to(readStgProspects.to(allMerge.input(2)))
  .add(allMerge)
  .to(matchingEngine)
  .to(hasMatch
    .onTrue(clearCustomerNotes.to(appendCustomerNotes))
    .onFalse(clearMatchingExceptions.to(appendMatchingExceptions))
  );
