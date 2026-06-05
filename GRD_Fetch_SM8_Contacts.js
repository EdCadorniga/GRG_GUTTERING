import { workflow, node, trigger, splitInBatches, nextBatch, newCredential, expr } from '@n8n/workflow-sdk';

const start = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Start', position: [0, 300] },
  output: [{}]
});

const fetchContacts = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Fetch SM8 Contacts',
    position: [224, 300],
    parameters: {
      method: 'GET',
      url: 'https://api.servicem8.com/api_1.0/companycontact.json',
      authentication: 'genericCredentialType',
      genericAuthType: 'oAuth2Api',
      sendQuery: true,
      specifyQuery: 'keypair',
      queryParameters: {
        parameters: [{ name: '$limit', value: '200' }]
      },
      options: {
        pagination: {
          pagination: {
            paginationMode: 'updateAParameterInEachRequest',
            parameters: {
              parameters: [{
                type: 'qs',
                name: 'cursor',
                value: "={{ $response.json[$response.json.length - 1].uuid }}"
              }]
            },
            limitPagesFetched: false,
            requestInterval: 500
          }
        }
      }
    },
    credentials: { oAuth2Api: newCredential('GRD GUTTERING APP') }
  },
  output: [{ company_uuid: 'uuid-123', email: 'test@example.com', phone: '0400000000', mobile: '0400000001' }]
});

const aggregateContacts = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Aggregate Contacts',
    position: [448, 300],
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: [
        "const items = $input.all();",
        "const map = new Map();",
        "for (const item of items) {",
        "  const j = item.json;",
        "  const cuid = j.company_uuid;",
        "  if (!cuid) continue;",
        "  if (!map.has(cuid)) {",
        "    map.set(cuid, { sm8_company_uuid: cuid, email: '', phone: '' });",
        "  }",
        "  const rec = map.get(cuid);",
        "  if (!rec.email && (j.email || '').trim()) rec.email = j.email.trim();",
        "  if (!rec.phone && (j.phone || '').trim()) rec.phone = j.phone.trim();",
        "  if (!rec.phone && (j.mobile || '').trim()) rec.phone = j.mobile.trim();",
        "}",
        "return Array.from(map.values()).map(function(r) { return { json: r }; });"
      ].join('\n')
    }
  },
  output: [{ sm8_company_uuid: 'uuid-123', email: 'test@example.com', phone: '0400000000' }]
});

const sib = splitInBatches({
  version: 3,
  config: { name: 'Process Companies', parameters: { batchSize: 1 }, position: [672, 300] }
});

const updateContactData = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Update Company Contact',
    position: [896, 300],
    parameters: {
      resource: 'row',
      operation: 'update',
      dataTableId: { __rl: true, mode: 'id', value: 'zSTAdsGxNzi1a4or' },
      matchType: 'allConditions',
      filters: {
        conditions: [{
          keyName: 'sm8_company_uuid',
          condition: 'eq',
          keyValue: expr('{{ $json.sm8_company_uuid }}')
        }]
      },
      columns: {
        mappingMode: 'autoMapInputData',
        value: null
      }
    }
  },
  output: [{ sm8_company_uuid: 'uuid-123', email: 'test@example.com', phone: '0400000000' }]
});

export default workflow(
  'GRD_Fetch_SM8_Contacts',
  'Fetch all SM8 company contacts and store email/phone in grd_sm8_client_uuids'
)
  .add(start)
  .to(fetchContacts)
  .to(aggregateContacts)
  .to(sib
    .onEachBatch(updateContactData.to(nextBatch(sib)))
  );
