import { workflow, node, trigger, expr, newCredential } from '@n8n/workflow-sdk';

const manualStart = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Manual Start', position: [0, 0] },
  output: [{}]
});

const fetchAllCompanies = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  credentials: { oAuth2Api: newCredential('GRD GUTTERING APP') },
  config: {
    name: 'Fetch All Companies',
    position: [240, 0],
    executeOnce: true,
    parameters: {
      method: 'GET',
      url: 'https://api.servicem8.com/api_1.0/company.json',
      authentication: 'genericCredentialType',
      genericAuthType: 'oAuth2Api',
      sendQuery: true,
      specifyQuery: 'keypair',
      queryParameters: {
        parameters: [
          { name: '$filter', value: "active eq 1" },
          { name: '$top', value: '1000' },
          { name: '$skip', value: '0' }
        ]
      },
      options: {
        pagination: {
          pagination: {
            paginationMode: 'updateAParameterInEachRequest',
            parameters: {
              parameters: [
                { type: 'qs', name: '$skip', value: expr('{{ Number($request.qs.$skip || 0) + 1000 }}') }
              ]
            },
            paginationCompleteWhen: 'other',
            completeExpression: expr('{{ $response.json.length < 1000 }}'),
            limitPagesFetched: true,
            maxRequests: 100
          }
        }
      },
      response: {
        responseFormat: 'json'
      }
    }
  },
  output: [{
    uuid: '123e4567-6514-4dbd-a86e-23f9456a4d3b',
    name: 'John Smith - Home',
    parent_company_uuid: 'abc-123-def-456',
    address_street: '12 Smith St',
    address_city: 'Springwood',
    address_state: 'QLD',
    address_postcode: '4127',
    create_date: '2026-03-01 12:00:00',
    active: 1
  }]
});

const identifyDuplicateSites = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Identify Duplicate Sites',
    position: [480, 0],
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: `
const MAX_DELETIONS_PER_RUN = 20;
const items = $input.all().map(function(item) {
  return item.json || {};
});

const sites = [];
for (const company of items) {
  const parentUuid = String(company.parent_company_uuid || '').trim();
  const uuid = String(company.uuid || '').trim();
  const name = String(company.name || '').trim();
  const active = Number(company.active ?? 1);

  if (!parentUuid || !uuid || !name || active !== 1) {
    continue;
  }

  sites.push({
    uuid: uuid,
    name: name,
    name_lower: name.toLowerCase(),
    parent_uuid: parentUuid,
    address_street: String(company.address_street || '').trim(),
    address_city: String(company.address_city || '').trim(),
    address_state: String(company.address_state || '').trim(),
    address_postcode: String(company.address_postcode || '').trim(),
    create_date: String(company.create_date || '').trim(),
    edit_date: String(company.edit_date || '').trim()
  });
}

const grouped = new Map();
for (const site of sites) {
  const groupKey = site.parent_uuid + '::' + site.name_lower;
  if (!grouped.has(groupKey)) {
    grouped.set(groupKey, []);
  }
  grouped.get(groupKey).push(site);
}

const deletions = [];
for (const group of grouped.values()) {
  group.sort(function(a, b) {
    const aKey = (a.create_date || a.edit_date || '') + '|' + a.uuid;
    const bKey = (b.create_date || b.edit_date || '') + '|' + b.uuid;
    if (aKey < bKey) return -1;
    if (aKey > bKey) return 1;
    return 0;
  });

  if (group.length < 2) continue;

  const keeper = group[0];
  for (let i = 1; i < group.length; i++) {
    const site = group[i];
    deletions.push({
      uuid: site.uuid,
      site_name: site.name,
      parent_uuid: site.parent_uuid,
      address: (site.address_street + ', ' + site.address_city + ', ' + site.address_state + ' ' + site.address_postcode).replace(/^, |, $/g, ''),
      keep_uuid: keeper.uuid,
      keep_name: keeper.name,
      keep_address: (keeper.address_street + ', ' + keeper.address_city + ', ' + keeper.address_state + ' ' + keeper.address_postcode).replace(/^, |, $/g, ''),
      duplicate_group_size: group.length
    });
  }
}

return deletions.slice(0, MAX_DELETIONS_PER_RUN).map(function(site) {
  return { json: site };
});
`
    }
  },
  output: [{
    uuid: '123e4567-6514-4dbd-a86e-23f9456a4d3b',
    site_name: 'John Smith - Home',
    parent_uuid: 'abc-123-def-456',
    address: '12 Smith St, Springwood, QLD 4127',
    keep_uuid: 'abc-def-ghi-jkl',
    keep_name: 'John Smith - Home',
    keep_address: '12 Smith St, Springwood, QLD 4127',
    duplicate_group_size: 2
  }]
});

const deleteDuplicateSite = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  credentials: { oAuth2Api: newCredential('GRD GUTTERING APP') },
  config: {
    name: 'Delete Duplicate Site',
    position: [720, 0],
    parameters: {
      method: 'DELETE',
      url: expr('https://api.servicem8.com/api_1.0/company.json/{{ $json.uuid }}'),
      authentication: 'genericCredentialType',
      genericAuthType: 'oAuth2Api',
      options: {
        batching: {
          batch: {
            batchSize: 1,
            batchInterval: 200
          }
        }
      },
      response: {
        responseFormat: 'json',
        neverError: true
      }
    }
  },
  output: [{
    errorCode: 0,
    message: 'OK'
  }]
});

export default workflow(
  'GRD_Duplicate_Sites_Cleanup',
  'Identifies and deletes duplicate child company sites in ServiceM8 (same parent + same name). Manual trigger, 20 deletions per run, 200ms API delay.'
)
  .add(manualStart)
  .to(fetchAllCompanies)
  .to(identifyDuplicateSites)
  .to(deleteDuplicateSite);
