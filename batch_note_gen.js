import { workflow, trigger, node, newCredential, merge } from '@n8n/workflow-sdk';

const webhook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webhook',
    parameters: { httpMethod: 'GET', path: 'grd-note-gen-batch', options: {}, responseMode: 'onReceived' }
  }
});

const config = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Config',
    parameters: { mode: 'raw', jsonOutput: '{"spreadsheetId":"19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y"}' }
  }
});

const readSheet = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Read Customer Notes',
    executeOnce: true,
    parameters: {
      resource: 'sheet', operation: 'read',
      documentId: { __rl: true, mode: 'id', value: '19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y' },
      sheetName: { __rl: true, mode: 'name', value: 'Customer Notes' },
      options: { returnAllMatches: 'returnAllMatches' }
    },
    credentials: { googleSheetsOAuth2Api: { id: 'SnkZZEvybquPKY8P', name: 'Google Sheets account' } }
  }
});

const pickBatch = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Pick Batch',
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: 'const items = $input.all();\nconst seen = new Set();\nconst matched = [];\nfor (const item of items) {\n  const j = item.json;\n  if (!j.ServiceM8_UUID || !j.Customer_Name) continue;\n  const name = j.Customer_Name.trim();\n  if (!name || seen.has(name.toLowerCase())) continue;\n  const note = (j.Note_Content || "").trim();\n  if (note && !note.startsWith("Customer imported from")) continue;\n  seen.add(name.toLowerCase());\n  matched.push({ name: name, uuid: j.ServiceM8_UUID, source: j.Source_Table || "" });\n}\nconst batch = matched.slice(0, 100);\nif (batch.length === 0) return [{ json: { _done: true, _message: "No more placeholder notes found" } }];\nconst esc = batch.map(function(m) { return "\'" + m.name.replace(/\'/g, "\'\'") + "\'"; }).join(",");\nconst qJH = "SELECT \"Customer_Name\", \"Job_Date\", \"Job_Type\", \"Job_Details\", \"Price\", \"Each\", \"Invoice_Number\" FROM \"data_table_user_wFGBDqBfhBF7aTfr\" WHERE \"Customer_Name\" IN (" + esc + ") ORDER BY \"Customer_Name\", \"Job_Date\"";\nconst qPR = "SELECT \"Prospect_Name\", \"Date_Added\", \"Status\", \"Estimate_Information\", \"Price\" FROM \"data_table_user_054q2ardHjYv1yE5\" WHERE \"Prospect_Name\" IN (" + esc + ") ORDER BY \"Prospect_Name\", \"Date_Added\"";\nreturn batch.map(function(m) { return { json: { Customer_Name: m.name, ServiceM8_UUID: m.uuid, Source_Table: m.source, _queryJH: qJH, _queryPR: qPR } }; });'
    }
  }
});

const queryJH = node({
  type: 'n8n-nodes-base.postgres',
  version: 2,
  config: {
    name: 'Query JH',
    executeOnce: true,
    parameters: {
      resource: 'database', operation: 'executeQuery',
      query: '={{ $json._queryJH }}',
      options: { replaceEmptyStrings: true }
    },
    credentials: { postgres: { id: 'G7OkQFeCA5TcNofu', name: 'Postgres account' } }
  }
});

const queryPR = node({
  type: 'n8n-nodes-base.postgres',
  version: 2,
  config: {
    name: 'Query PR',
    executeOnce: true,
    parameters: {
      resource: 'database', operation: 'executeQuery',
      query: '={{ $json._queryPR }}',
      options: { replaceEmptyStrings: true }
    },
    credentials: { postgres: { id: 'G7OkQFeCA5TcNofu', name: 'Postgres account' } }
  }
});

const mergeAll = merge({
  version: 3.2,
  config: { name: 'Merge All', parameters: { mode: 'append', numberInputs: 3 } }
});

const jsCode = 'const items = $input.all();\n'
+ 'function fd(d) { if(!d) return ""; var p=d.split(/[\\\\/\\\\-]/); if(p.length===3){var dd=+p[0],m=+p[1],y=+p[2]; if(y<100)y+=2000; var ms=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return dd+" "+ms[m-1]+" "+y; } return d; }\n'
+ 'function fc(v) { if(!v) return ""; var n=parseFloat(String(v).replace(/[$,]/g,"")); if(isNaN(n)) return String(v).trim(); return "$"+n.toFixed(2).replace(/(\\d)(?=(\\d{3})+(?!\\d))/g,"$1,"); }\n'
+ 'function pr(s,n) { s=String(s||""); return s.length>=n?s.substring(0,n):s+" ".repeat(n-s.length); }\n'
+ 'var cust=[], jhM=new Map(), prM=new Map();\n'
+ 'for(var i=0;i<items.length;i++){\n'
+ '  var j=items[i].json;\n'
+ '  if(j.ServiceM8_UUID&&j.Customer_Name){ cust.push(j); }\n'
+ '  else if(j.Job_Date){ var nk=(j.Customer_Name||"").trim().toLowerCase(); if(nk){ if(!jhM.has(nk))jhM.set(nk,[]); jhM.get(nk).push(j); } }\n'
+ '  else if(j.Prospect_Name){ var nk2=(j.Prospect_Name||"").trim().toLowerCase(); if(nk2){ if(!prM.has(nk2))prM.set(nk2,[]); prM.get(nk2).push(j); } }\n'
+ '}\n'
+ 'var res=[];\n'
+ 'for(var i=0;i<cust.length;i++){\n'
+ '  var c=cust[i], nm=(c.Customer_Name||"").trim(), nl=nm.toLowerCase();\n'
+ '  var myJH=jhM.get(nl)||[], myPR=prM.get(nl)||[], np=[];\n'
+ '  if(myJH.length>0){\n'
+ '    np.push("--- Job History ("+myJH.length+" records) ---");\n'
+ '    for(var k=0;k<myJH.length;k++){ var r=myJH[k]; np.push(pr(fd(r.Job_Date),14)+" "+pr((r.Job_Type||"").substring(0,18),20)+" "+(r.Job_Details||"").substring(0,50)+"  "+pr(fc(r.Price||r.Each||""),12)+"  "+(r.Invoice_Number?"Inv: "+r.Invoice_Number:"")); }\n'
+ '    np.push("");\n'
+ '  }\n'
+ '  if(myPR.length>0){\n'
+ '    np.push("--- Quotes / Estimates ("+myPR.length+" records) ---");\n'
+ '    for(var k=0;k<myPR.length;k++){ var r=myPR[k]; var d=r.Date_Added?fd(r.Date_Added):""; np.push(pr(d,14)+" "+pr((r.Status||"").substring(0,14),16)+" "+(r.Estimate_Information||"").substring(0,70)+" o "+fc(r.Price||r.Each||"")); }\n'
+ '    np.push("");\n'
+ '  }\n'
+ '  res.push({json:{Customer_Name:nm,ServiceM8_UUID:c.ServiceM8_UUID,Source_Table:c.Source_Table,Note_Content:np.join("\\n").trim(),Approval_Status:"Pending"}});\n'
+ '}\n'
+ 'return res;';

const generateNotes = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Generate Notes',
    parameters: { mode: 'runOnceForAllItems', jsCode: jsCode }
  }
});

const appendSheet = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Append to Sheet',
    parameters: {
      resource: 'sheet', operation: 'append',
      documentId: { __rl: true, mode: 'id', value: '19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y' },
      sheetName: { __rl: true, mode: 'name', value: 'Customer Notes' },
      columns: { mappingMode: 'autoMapInputData', value: {} },
      options: { useAppend: true }
    },
    credentials: { googleSheetsOAuth2Api: { id: 'SnkZZEvybquPKY8P', name: 'Google Sheets account' } }
  }
});

export default workflow('grd-note-gen-batch', 'GRD_Note_Generate_Batch')
  .add(webhook)
  .to(config)
  .to(readSheet)
  .to(pickBatch)
  .add(pickBatch)
  .to(queryJH.to(mergeAll.input(0)))
  .add(pickBatch)
  .to(queryPR.to(mergeAll.input(1)))
  .add(pickBatch)
  .to(mergeAll.input(2))
  .add(mergeAll)
  .to(generateNotes)
  .to(appendSheet);
