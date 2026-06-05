const fs = require('fs');
const companies = JSON.parse(fs.readFileSync('sm8_companies.json', 'utf8'));
const now = new Date().toISOString();

const rows = companies.map(c => ({
  customer_name: (c.name || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'"),
  sm8_company_uuid: c.uuid,
  site_address: (c.address || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'"),
  source_table: 'sm8_companies',
  ingested_at: now
}));

const dataJson = JSON.stringify(rows);

const parts = [];
for (let i = 0; i < rows.length; i += 200) {
  parts.push(JSON.stringify(rows.slice(i, i + 200)));
}
console.log('Split into ' + parts.length + ' parts of 200 rows each');

// Write the data as a JSON file that can be read by the workflow
fs.writeFileSync('sm8_workflow_data.json', dataJson, 'utf8');
console.log('Data file written: ' + Buffer.byteLength(dataJson, 'utf8') + ' bytes');

// Generate a simple workflow script that doesn't embed all data
const code = `
import { workflow, node, trigger } from "@n8n/workflow-sdk";

const start = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Start' }
});

export default workflow("GRD_SM8_Bulk_Upsert", "Bulk insert 2455 SM8 companies into grd_sm8_client_uuids")
  .add(start);
`;

fs.writeFileSync('simple_workflow.mjs', code.trim(), 'utf8');
console.log('Workflow code written');
