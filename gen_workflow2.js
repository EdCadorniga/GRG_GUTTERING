const fs = require('fs');
const companies = JSON.parse(fs.readFileSync('sm8_companies.json', 'utf8'));
const now = new Date().toISOString();

const rows = companies.map(c => ({
  customer_name: c.name || '',
  sm8_company_uuid: c.uuid,
  site_address: c.address || '',
  source_table: 'sm8_companies',
  ingested_at: now
}));

// Generate the data JSON string for embedding in the Code node
const dataJson = JSON.stringify(rows);

// Build the workflow SDK code
const lines = [];

lines.push('import { workflow, node, trigger, expr } from "@n8n/workflow-sdk";');
lines.push('');
lines.push('const start = trigger({ type: "n8n-nodes-base.manualTrigger", version: 1, config: { name: "Start" } });');
lines.push('');

// Embed data in the Code node's jsCode
const escapedJson = dataJson.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');
lines.push('const codeNode = node({');
lines.push('  type: "n8n-nodes-base.code",');
lines.push('  version: 2,');
lines.push('  config: {');
lines.push('    name: "Companies Data",');
lines.push('    parameters: {');
lines.push('      language: "javaScript",');
lines.push('      jsCode: `');
lines.push('const data = JSON.parse(\'' + escapedJson.replace(/'/g, "\\'") + '\');');
lines.push('return data;');
lines.push('`');
lines.push('    }');
lines.push('  }');
lines.push('});');
lines.push('');

lines.push('const upsertNode = node({');
lines.push('  type: "n8n-nodes-base.dataTable",');
lines.push('  version: 1.1,');
lines.push('  config: {');
lines.push('    name: "Upsert Companies",');
lines.push('    parameters: {');
lines.push('      resource: "row",');
lines.push('      operation: "upsert",');
lines.push('      dataTableId: { __rl: true, mode: "id", value: "zSTAdsGxNzi1a4or", cachedResultName: "grd_sm8_client_uuids" },');
lines.push('      matchType: "allConditions",');
lines.push('      filters: {');
lines.push('        conditions: [{ keyName: "customer_name", condition: "eq", keyValue: expr("{{ $json.customer_name }}") }]');
lines.push('      },');
lines.push('      columns: {');
lines.push('        mappingMode: "defineBelow",');
lines.push('        value: {');
lines.push('          customer_name: expr("{{ $json.customer_name }}"),');
lines.push('          sm8_company_uuid: expr("{{ $json.sm8_company_uuid }}"),');
lines.push('          site_address: expr("{{ $json.site_address }}"),');
lines.push('          source_table: expr("{{ $json.source_table }}"),');
lines.push('          ingested_at: expr("{{ $json.ingested_at }}")');
lines.push('        },');
lines.push('        schema: [');
lines.push('          { id: "customer_name", displayName: "customer_name", required: false, defaultMatch: false, display: true, type: "string", canBeUsedToMatch: true },');
lines.push('          { id: "sm8_company_uuid", displayName: "sm8_company_uuid", required: false, defaultMatch: false, display: true, type: "string", canBeUsedToMatch: false },');
lines.push('          { id: "site_address", displayName: "site_address", required: false, defaultMatch: false, display: true, type: "string", canBeUsedToMatch: false },');
lines.push('          { id: "source_table", displayName: "source_table", required: false, display: true, type: "string", canBeUsedToMatch: false },');
lines.push('          { id: "ingested_at", displayName: "ingested_at", required: false, display: true, type: "string", canBeUsedToMatch: false }');
lines.push('        ]');
lines.push('      }');
lines.push('    }');
lines.push('  }');
lines.push('});');
lines.push('');
lines.push('export default workflow("GRD_SM8_Bulk_Upsert", "Upsert 2455 SM8 companies into grd_sm8_client_uuids")');
lines.push('  .add(start)');
lines.push('  .to(codeNode)');
lines.push('  .to(upsertNode);');

const code = lines.join('\n');
fs.writeFileSync('full_workflow.mjs', code, 'utf8');
console.log('Code size: ' + Buffer.byteLength(code, 'utf8') + ' bytes');
