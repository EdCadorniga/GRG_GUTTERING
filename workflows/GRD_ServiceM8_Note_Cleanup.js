import { workflow, node, trigger, expr, newCredential } from '@n8n/workflow-sdk';

const manualStart = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Manual Start', position: [0, 0] },
  output: [{}]
});

const readCompanyNotes = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  credentials: { oAuth2Api: newCredential('GRD GUTTERING APP') },
  config: {
    name: 'Read Company Notes',
    position: [240, 0],
    executeOnce: true,
    parameters: {
      method: 'GET',
      url: 'https://api.servicem8.com/api_1.0/note.json',
      authentication: 'genericCredentialType',
      genericAuthType: 'oAuth2Api',
      sendQuery: true,
      specifyQuery: 'keypair',
      queryParameters: {
        parameters: [
          { name: '$filter', value: "active eq 1 and related_object eq 'company'" },
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
    active: 1,
    related_object: 'company',
    related_object_uuid: '123e4567-7a1d-46ad-9f41-23f94779ab8b',
    note: 'Example note',
    create_date: '2026-03-01 12:00:00'
  }]
});

const buildCleanupCandidates = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Cleanup Candidates',
    position: [480, 0],
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: `
const PLACEHOLDER_MARKERS = [
  'customer imported from job history after full data review.',
  'customer imported from prospects after full data review.',
  'customer imported from job history, prospects after full data review.'
];
const MAX_DELETIONS_PER_RUN = 20;

const notes = $input.all().map(function(item) {
  return item.json || {};
});

function normalizeText(value) {
  return String(value || '').replace(/\\s+/g, ' ').trim();
}

function isPlaceholder(textLower) {
  for (const marker of PLACEHOLDER_MARKERS) {
    if (textLower.includes(marker)) {
      return true;
    }
  }
  return false;
}

const companyNotes = [];
for (const note of notes) {
  const relatedObject = String(note.related_object || '').trim().toLowerCase();
  const active = Number(note.active ?? 1);
  if (relatedObject !== 'company' || active !== 1) {
    continue;
  }

  const uuid = String(note.uuid || '').trim();
  const companyUuid = String(note.related_object_uuid || '').trim();
  const normalizedText = normalizeText(note.note);
  if (!uuid || !normalizedText) {
    continue;
  }

  companyNotes.push({
    uuid,
    company_uuid: companyUuid,
    note_text: normalizedText,
    note_text_lower: normalizedText.toLowerCase(),
    create_date: String(note.create_date || '').trim(),
    edit_date: String(note.edit_date || '').trim()
  });
}

const grouped = new Map();
const deletions = [];

for (const note of companyNotes) {
  if (isPlaceholder(note.note_text_lower)) {
    deletions.push({
      uuid: note.uuid,
      company_uuid: note.company_uuid,
      note_text: note.note_text,
      create_date: note.create_date,
      cleanup_reason: 'placeholder_text',
      keep_uuid: '',
      duplicate_group_size: 1
    });
    continue;
  }

  if (!note.company_uuid) {
    continue;
  }

  const groupKey = note.company_uuid + '::' + note.note_text_lower;
  if (!grouped.has(groupKey)) {
    grouped.set(groupKey, []);
  }
  grouped.get(groupKey).push(note);
}

for (const group of grouped.values()) {
  group.sort(function(a, b) {
    const aKey = (a.create_date || a.edit_date || '') + '|' + a.uuid;
    const bKey = (b.create_date || b.edit_date || '') + '|' + b.uuid;
    if (aKey < bKey) return -1;
    if (aKey > bKey) return 1;
    return 0;
  });

  const keeper = group[0];
  for (let i = 1; i < group.length; i++) {
    const note = group[i];
    deletions.push({
      uuid: note.uuid,
      company_uuid: note.company_uuid,
      note_text: note.note_text,
      create_date: note.create_date,
      cleanup_reason: 'duplicate_company_note',
      keep_uuid: keeper.uuid,
      duplicate_group_size: group.length
    });
  }
}

return deletions.slice(0, MAX_DELETIONS_PER_RUN).map(function(note) {
  return { json: note };
});
`
    }
  },
  output: [{
    uuid: '123e4567-6514-4dbd-a86e-23f9456a4d3b',
    company_uuid: '123e4567-7a1d-46ad-9f41-23f94779ab8b',
    note_text: 'Example note',
    create_date: '2026-03-01 12:00:00',
    cleanup_reason: 'duplicate_company_note',
    keep_uuid: '123e4567-1111-2222-3333-123456789abc',
    duplicate_group_size: 2
  }]
});

const deleteCompanyNote = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  credentials: { oAuth2Api: newCredential('GRD GUTTERING APP') },
  config: {
    name: 'Delete Company Note',
    position: [720, 0],
    parameters: {
      method: 'DELETE',
      url: expr('https://api.servicem8.com/api_1.0/note.json/{{ $json.uuid }}'),
      authentication: 'genericCredentialType',
      genericAuthType: 'oAuth2Api',
      options: {
        batching: {
          batch: {
            batchSize: 1,
            batchInterval: 2000
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
  'GRD_ServiceM8_Note_Cleanup',
  'Delete duplicate and placeholder ServiceM8 company notes'
)
  .add(manualStart).to(readCompanyNotes)
  .add(readCompanyNotes).to(buildCleanupCandidates)
  .add(buildCleanupCandidates).to(deleteCompanyNote);
