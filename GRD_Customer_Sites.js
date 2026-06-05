import { workflow, node, trigger } from '@n8n/workflow-sdk';

const SS = '19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y';
const SM8_TABLE = 'zSTAdsGxNzi1a4or';
const gsCred = { id: 'SnkZZEvybquPKY8P', name: 'Google Sheets account' };

const start = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Start' }
});

const config = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Config',
    parameters: {
      mode: 'raw',
      jsonOutput: JSON.stringify({
        spreadsheetId: SS,
        sm8UuidsTableId: SM8_TABLE,
        customerSitesTab: 'Customer Sites'
      })
    }
  }
});

const readSM8 = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Read SM8 UUIDs',
    parameters: {
      resource: 'row',
      operation: 'get',
      dataTableId: { __rl: true, mode: 'id', value: SM8_TABLE },
      returnAll: true
    },
    executeOnce: true
  }
});

const extractSites = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Extract Unique Sites',
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: `
const items = $input.all();
const siteMap = new Map();
for (const item of items) {
  const j = item.json;
  const name = (j.customer_name || '').trim();
  const uuid = (j.sm8_company_uuid || '').trim();
  const address = (j.site_address || '').trim();
  if (!name || !address) continue;
  const key = name.toLowerCase() + '|' + address.toLowerCase();
  if (!siteMap.has(key)) {
    siteMap.set(key, {
      Customer_Name: name,
      ServiceM8_UUID: uuid,
      Site_Address: address,
      Site_UUID: (j.sm8_site_uuid || '').trim(),
      Source_Table: (j.source_table || 'sm8').trim(),
      Row_Count: 0
    });
  }
  siteMap.get(key).Row_Count++;
}
return Array.from(siteMap.values()).map(v => ({ json: v }));
`
    }
  }
});

const clearSites = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Clear Customer Sites',
    credentials: { googleSheetsOAuth2Api: gsCred },
    parameters: {
      resource: 'sheet',
      operation: 'clear',
      documentId: { __rl: true, mode: 'id', value: SS },
      sheetName: { __rl: true, mode: 'name', value: 'Customer Sites' },
      clear: 'wholeSheet',
      keepFirstRow: true
    }
  }
});

const appendSites = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Append to Customer Sites',
    credentials: { googleSheetsOAuth2Api: gsCred },
    parameters: {
      resource: 'sheet',
      operation: 'append',
      documentId: { __rl: true, mode: 'id', value: SS },
      sheetName: { __rl: true, mode: 'name', value: 'Customer Sites' },
      columns: { mappingMode: 'autoMapInputData', value: {} },
      options: { useAppend: true }
    }
  }
});

export default workflow('GRD_Customer_Sites', 'Extract unique customer-site addresses and populate Customer Sites tab')
  .add(start)
  .to(config)
  .to(readSM8)
  .to(extractSites)
  .to(clearSites)
  .to(appendSites);
