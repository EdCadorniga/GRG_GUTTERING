import { workflow, node, trigger, newCredential, expr } from '@n8n/workflow-sdk';

const startTrigger = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Start', position: [240, 300] },
  output: [{}]
});

const getRows = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Get RJS Sites',
    parameters: {
      resource: 'row',
      operation: 'get',
      dataTableId: { __rl: true, mode: 'list', value: '06OWsWuHEQqmG4yq' },
      returnAll: true
    },
    position: [540, 300]
  },
  output: [{ Customer_Name: 'Customer', Site_Name: 'Site', Site_Address: 'Address', Site_Phone: 'Phone', Approval_Status: 'Pending', Review_Notes: 'Notes' }]
});

const appendSheet = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Append to Sheet',
    parameters: {
      resource: 'sheet',
      operation: 'append',
      authentication: 'oAuth2',
      documentId: { __rl: true, mode: 'list', value: '19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y' },
      sheetName: { __rl: true, mode: 'name', value: 'Customer Sites' },
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
        }
      },
      options: {}
    },
    credentials: {
      googleSheetsOAuth2Api: newCredential('Google Sheets account')
    },
    position: [840, 300]
  },
  output: [{}]
});

export default workflow('GRD_RJS_Sites_Append', 'Read RJS sites from Data Table and append to Google Sheet')
  .add(startTrigger)
  .to(getRows)
  .to(appendSheet);
