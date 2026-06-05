import { workflow, node, trigger, merge, splitInBatches, nextBatch, expr } from '@n8n/workflow-sdk';

const SS = '19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y';
const gsCred = { id: 'SnkZZEvybquPKY8P', name: 'Google Sheets account' };

const codeStr = `
const items = $input.all();
const uuidMap = new Map();
const siteMap = new Map();
for (const item of items) {
  const j = item.json;
  const src = j._source;
  if (src === 'sm8') {
    const name = (j.customer_name || '').trim();
    const uuid = (j.sm8_company_uuid || '').trim();
    if (name && uuid) { const key = name.toLowerCase(); if (!uuidMap.has(key)) uuidMap.set(key, uuid); }
  }
  if (src === 'jh') {
    const name = (j.Customer_Name || '').trim();
    const addr = (j.Job_location || '').trim();
    if (!name || !addr) continue;
    const uuid = uuidMap.get(name.toLowerCase()) || '';
    if (!uuid) continue;
    const key = name.toLowerCase() + '|' + addr.toLowerCase();
    if (!siteMap.has(key)) {
      siteMap.set(key, { Customer_Name: name, Customer_UUID: uuid, Site_Name: addr, Site_Address: addr, Site_Phone: '', Approval_Status: 'Pending', Review_Notes: '' });
    }
  }
  if (src === 'pr') {
    const name = (j.Prospect_Name || '').trim();
    const addr = (j.Estimate_Location || '').trim();
    if (!name || !addr) continue;
    const uuid = uuidMap.get(name.toLowerCase()) || '';
    if (!uuid) continue;
    const key = name.toLowerCase() + '|' + addr.toLowerCase();
    if (!siteMap.has(key)) {
      siteMap.set(key, { Customer_Name: name, Customer_UUID: uuid, Site_Name: addr, Site_Address: addr, Site_Phone: '', Approval_Status: 'Pending', Review_Notes: '' });
    }
  }
}
return [{ json: { Customer_Name: 'TOTAL: ' + siteMap.size, Customer_UUID: '', Site_Name: '', Site_Address: '', Site_Phone: '', Approval_Status: '', Review_Notes: '' } }, ...Array.from(siteMap.values()).map(v => ({ json: v }))];
`;

const start = trigger({ type: 'n8n-nodes-base.manualTrigger', version: 1, config: { name: 'Start' } });

const clear = node({
  type: 'n8n-nodes-base.googleSheets', version: 4.7,
  config: {
    name: 'Clear Sheet',
    credentials: { googleSheetsOAuth2Api: gsCred },
    parameters: { resource: 'sheet', operation: 'clear', documentId: { __rl: true, mode: 'id', value: SS }, sheetName: { __rl: true, mode: 'name', value: 'Customer Sites' }, clear: 'wholeSheet', keepFirstRow: true },
    executeOnce: true
  }
});

const gate = node({ type: 'n8n-nodes-base.set', version: 3.4, config: { name: 'Gate', parameters: { mode: 'manual', assignments: { assignments: [] }, includeOtherFields: true } } });

const readSM8 = node({ type: 'n8n-nodes-base.dataTable', version: 1.1, config: { name: 'Read SM8 UUIDs', parameters: { resource: 'row', operation: 'get', dataTableId: { __rl: true, mode: 'id', value: 'zSTAdsGxNzi1a4or' }, returnAll: true }, executeOnce: true } });
const tagSM8 = node({ type: 'n8n-nodes-base.set', version: 3.4, config: { name: 'Tag SM8', parameters: { mode: 'manual', includeOtherFields: true, assignments: { assignments: [{ id: 's', name: '_source', value: 'sm8', type: 'string' }] } } } });

const readJH = node({ type: 'n8n-nodes-base.dataTable', version: 1.1, config: { name: 'Read JH', parameters: { resource: 'row', operation: 'get', dataTableId: { __rl: true, mode: 'id', value: 'wFGBDqBfhBF7aTfr' }, returnAll: true }, executeOnce: true } });
const tagJH = node({ type: 'n8n-nodes-base.set', version: 3.4, config: { name: 'Tag JH', parameters: { mode: 'manual', includeOtherFields: true, assignments: { assignments: [{ id: 's', name: '_source', value: 'jh', type: 'string' }] } } } });

const readPR = node({ type: 'n8n-nodes-base.dataTable', version: 1.1, config: { name: 'Read PR', parameters: { resource: 'row', operation: 'get', dataTableId: { __rl: true, mode: 'id', value: '054q2ardHjYv1yE5' }, returnAll: true }, executeOnce: true } });
const tagPR = node({ type: 'n8n-nodes-base.set', version: 3.4, config: { name: 'Tag PR', parameters: { mode: 'manual', includeOtherFields: true, assignments: { assignments: [{ id: 's', name: '_source', value: 'pr', type: 'string' }] } } } });

const merged = merge({ version: 3.2, config: { name: 'Merge', parameters: { mode: 'append', numberInputs: 3 } } });

const extract = node({ type: 'n8n-nodes-base.code', version: 2, config: { name: 'Extract Sites', parameters: { mode: 'runOnceForAllItems', jsCode: codeStr } } });

const sib = splitInBatches({ version: 3, config: { name: 'Batch Appends', parameters: { batchSize: 200 } } });

const append = node({
  type: 'n8n-nodes-base.googleSheets', version: 4.7,
  config: {
    name: 'Append Batch',
    credentials: { googleSheetsOAuth2Api: gsCred },
    parameters: { resource: 'sheet', operation: 'append', documentId: { __rl: true, mode: 'id', value: SS }, sheetName: { __rl: true, mode: 'name', value: 'Customer Sites' }, columns: { mappingMode: 'autoMapInputData', value: {} }, options: { useAppend: true } },
    executeOnce: true
  }
});

export default workflow('GRD_CustomerSites_Generate', 'Extract unique job sites, batch append to Customer Sites')
  .add(start)
  .to(clear)
  .to(gate)
  .to(readSM8).to(tagSM8).to(merged.input(0))
  .add(gate)
  .to(readJH).to(tagJH).to(merged.input(1))
  .add(gate)
  .to(readPR).to(tagPR).to(merged.input(2))
  .add(merged)
  .to(extract)
  .to(sib
    .onEachBatch(append.to(nextBatch(sib)))
  );
