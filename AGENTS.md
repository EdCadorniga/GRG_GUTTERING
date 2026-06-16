# AGENTS.md

## Project Context
This repository captures the requirements and delivery plan for the GRD Guttering / Katwill Services ServiceM8 automation work.

Primary source files (under `docs/`):
- `docs/Email Conversation.txt`
- `docs/assets/Accepted quote email notification.pdf`
- `docs/assets/Quote opened email notification.pdf`
- `data/samples/Customer Job History-sample.csv`
- `data/samples/prospects-sample.csv`

## Working Rules
1. Treat the conversation and attachments as the source of truth for scope and behavior.
2. Use the sample CSVs as working schema references.
3. Do not assume The Customer Factor has an API.
4. Keep historical job data safe and reviewable before writing to ServiceM8.
5. Cancel PDF approach — notes on existing SM8 companies only.
6. Quote-open tracking: redirect bridge or separate quoting tool.
7. Preserve auditability.
8. Handle duplicate rows defensively.

## Agent Execution Rules (Token Efficiency)
- **Reasoning Budget**: Max 3 reasoning steps per tool invocation.
- **Direct Execution**: Call MCP tools immediately when they match intent.
- **No Self-Reflective Loops**: No sanity checks on completed outputs unless structural error.
- **Concise Planning**: One sentence before formatting tool block.
- **Mandatory Repomix Read**: READ `repomix-output.md` FIRST in every conversation.
- **Repository Layout**: Use repomix-output.md as primary structural map.

## Session Resume Context

### n8n Environment
- Instance: https://automation.katwillservices.com.au
- Project ID: HfMlqgFS6NFMj6hI ("Automations Server <admin@sm8setup.com.au>")
- Review Sheet: https://docs.google.com/spreadsheets/d/19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y/edit

### Key Credential IDs
| Credential | Type | ID |
|------------|------|-----|
| Google Sheets account | googleSheetsOAuth2Api | SnkZZEvybquPKY8P |
| GRD GUTTERING APP | oAuth2 (ServiceM8) | 9xTqnOrjPITTQoxc |
| Katwill ServiceM8 Credentials | serviceM8CredentialsApi | K9hkbJn20IjLJ8bg |
| Postgres account | postgres | G7OkQFeCA5TcNofu |
| VPS Caddy SSH | sshPrivateKey | XwN2JVjbC2hesER8 |
| Katwill SM8 API Key | httpHeaderAuth | GPcEchQEV01z2dDz |

### Data Table IDs
| Table | ID | Backing Postgres Table |
|-------|-----|------------------------|
| stg_job_history (46 cols) | wFGBDqBfhBF7aTfr | data_table_user_wFGBDqBfhBF7aTfr |
| stg_prospects (22 cols) | 054q2ardHjYv1yE5 | data_table_user_054q2ardHjYv1yE5 |
| stg_cf_contacts (45 cols) | Ki0oGme1ckXRGZtP | data_table_user_Ki0oGme1ckXRGZtP |
| grd_sm8_client_uuids (8 cols) | zSTAdsGxNzi1a4or | data_table_user_zSTAdsGxNzi1a4or |
| grd_note_upload_log (5 cols) | 8tEfzXuwTSE793Xk | data_table_user_8tEfzXuwTSE793Xk |
| canonical_job_history | gE5K70r1k0eTyHOo | data_table_user_gE5K70r1k0eTyHOo |
| canonical_prospects | lDksvkIAticx7Jh5 | data_table_user_lDksvkIAticx7Jh5 |
| katwill_quote_events | bTOGqeK0T9elwlDU | — |
| rjs_sites | 5YEAz1SyFc0Y4bxS | — |

### Active Workflows (in n8n)
| Workflow | ID | Trigger | Description |
|----------|----|---------|-------------|
| GRD_HistoricalJobHistory_Ingest | 8mLRB5VpBKisvsUU | Manual | Ingest CSV into stg_job_history |
| GRD_Prospects_Ingest | QAOmPf3a4dpBeQ61 | Manual | Ingest CSV into stg_prospects |
| GRD_CF_Contacts_Ingest | tJhlMwIiaPRYtDp5 | Webhook | Ingest CF CSV into stg_cf_contacts |
| GRD_Match_CSV_to_SM8 (v3) | 7kEUmyDsb8TFYizO | Manual | Exact name matching only |
| GRD_CF_Match_to_UUID | BNcVsucXZc9c0oyk | Manual | Match CF contacts to SM8 UUIDs |
| GRD_Note_Generate_Batch | KJA8xCVC1ajwBDit | Manual | Postgres IN filter, 50/batch |
| GRD_Note_Upload_Batch | ipD5QpBO7ffBHPEK | Manual + 5min | Upload 50 notes/run |
| GRD_ServiceM8_Duplicate_and_Placeholder_Notes_Cleanup | QFFLC3wOzQOynhas | 10min | Paginate + delete dup notes |
| GRD_CustomerSites_Generate | IMj5uhFkElJWDcv5 | Manual | CF contacts + SM8 UUIDs → Google Sheets |
| GRD_Set_Approval_Validation | QkNVzlIMWM5nUbEq | Manual | Set Approval_Status dropdown on column F |
| GRD_RJS_Sites_Append | aoNiAnCCsCTkZWLu | Manual | Append RJS sites to Customer Sites tab |
| GRD_Site_Import | 3xsqBGKnV8o4F07p | Manual + 10min | *(deactivated — replaced by cleanup)* |
| GRD_Cleanup_Single_Site_Customers | seTKGjvK4YJMJIwi | Manual | Reads CustomerSitesForCleanup sheet, identifies single-site customers, marks Delete in sheet, deletes from SM8, marks Deleted in sheet |
| GRD_QuoteEvent_Receiver | xsIKmyZb5t5TsZhG | SM8 Event Webhook | Receives SM8 native event webhooks for quote_sent, proposal_sent, proposal_viewed, quote_accepted — fetches job, routes, emails alert |
| GRD_QuoteOpenBridge_v1 | LEcdO6TYQ2B1X9ia | Webhook GET | *(deactivated — replaced by GRD_QuoteEvent_Receiver)* |
| GRD_QuoteSent_Tracker | sdtvgdpvcdciB77W | 30min poll | *(deactivated — replaced by GRD_QuoteEvent_Receiver)* |
| GRD_QuoteAccepted_Tracker | u6qdYM5qyiqKcAp5 | 30min poll | *(deactivated — replaced by GRD_QuoteEvent_Receiver)* |
| KAT_QuoteOpenBridge | MyqBzn4gARYShwhb | Webhook GET | *(active but pending replacement by SM8 webhooks)* |
| KAT_QuoteSent_Tracker | C51R73lpe7tsmqWT | 30min poll | *(active but pending replacement by SM8 webhooks)* |
| KAT_QuoteAccepted_Tracker | XZ7PwspH6UeShjGK | 30min poll | *(active but pending replacement by SM8 webhooks)* |

### Project Status Summary

**Data ingested:** 15K CF contacts, 51K job history rows, 5K prospects, 2.4K SM8 companies
**Match results:** 1,925 exact name matches (17.4%); 1,647 CF→SM8 UUIDs; all 3,997 Customer Sites have UUIDs
**Notes:** 1,712 JH + 180 PR + 202 "No records" = all 1,925 covered. 0 placeholders.
**Site import:** Active, 50/batch, 200ms delay, 10-min schedule. Reads approved rows → parse AU address → POST company.json
**Quote tracking:** Quote-sent and quote-accepted trackers active. QuoteOpenBridge v1 deployed (webhook 302 redirect), but both being replaced by native SM8 event webhooks.

### Next Steps (ordered)
1. **Id-chain fallback matching** for ~2,321 unmatched CF names (CF Id → JH/PR Id → customer_name → UUID lookup)
2. **Fuzzy matching** for remaining unmatched names (Dice coefficient or phone/email)
3. **New SM8 company creation** for unmatched names with no existing company
4. Re-run Note Generate & Upload with improved matching
5. **Rebuild Phase 2 quote notifications using SM8 event webhooks** — replace polling trackers and bridge with `job.quote_sent`, `proposal.sent`, `proposal.viewed`, `job.quote_accepted` webhooks. No SM8 email template changes required.

### Known Issues (n8n / ServiceM8)
- `$credentials` NOT available in n8n Code nodes (sandboxed). Use HTTP Request node with OAuth2 credential instead.
- Data Table Insert node broken — use REST API workaround.
- **Use ONLY `n8n_katwill_*` MCP tools** for n8n access. Do not use `n8n_lt_*` or `n8n_mcp_*` tools.
- ServiceM8 HTTP Request nodes can use the `GRD GUTTERING APP` OAuth2 credential (9xTqnOrjPITTQoxc).
- ServiceM8 API base URL is `/api_1.0`. Note endpoint: `POST /api_1.0/note.json` with `related_object: "company"`.
- Direct Postgres queries on Data Table backing tables return NULL for most data. Use Data Table node for reads.
- SM8 companycontact.json has <1% email/phone coverage.
- Code node output truncation at 1.5MB limit.
- n8n Code nodes: double-quote SQL identifiers require `String.fromCharCode(34)` workaround.
- HTTP Request `jsonBody` must contain valid JSON with no extra/missing braces.
- HTTP Request with `predefinedCredentialType`: credential key must match credential type name, NOT the node interface key.
- CRITICAL: n8n IF node conditions comparing `{{ $json.field }}` to booleans silently fails. Use `String($json.field)` and compare to string `"true"`/`"false"`, or use Switch nodes.
- Google Sheets `appendOrUpdate` with `autoMapInputData` requires proper schema. Use `defineBelow` for API-created nodes.
- UI overwrites API changes: avoid opening workflow in editor after making API changes.
- For `availableInMCP: true`, use `n8n_katwill_remote_create_workflow_from_code`.
- Use `n8n_katwill_remote_update_workflow` for general updates; use legacy `n8n_katwill_update_workflow` for credential assignment.
- ServiceM8 rate limits: 180 req/min, 20,000 req/day.

### Repository Structure
```
/ (root)
├── AGENTS.md              ← This file
├── repomix-output.md      ← Auto-generated repo map (READ FIRST)
├── repomix.config.json
├── .repomixignore
├── .gitignore
├── .env                   ← API keys (gitignored)
├── docs/
│   ├── Email Conversation.txt
│   ├── Customer Plan.md
│   ├── project-specs.md
│   └── assets/
│       ├── Accepted quote email notification.pdf
│       ├── Quote opened email notification.pdf
│       └── screenshot of where Customer Sites should appear.png
├── workflows/
│   ├── GRD_Site_Import.js
│   ├── GRD_Note_Upload_Batch.js
│   ├── GRD_Match_CSV_to_SM8.js
│   ├── GRD_CustomerSites_Create.js
│   ├── GRD_CustomerSites_Generate.js
│   ├── GRD_Note_Generate.js
│   ├── GRD_ServiceM8_Note_Cleanup.js
│   ├── GRD_Note_Upload.js
│   ├── GRD_Customer_Sites.js
│   ├── GRD_Fetch_SM8_Contacts.js
│   ├── GRD_RJS_Sites_Append.js
│   ├── GRD_QuoteOpenBridge_v1.js
│   ├── batch_upload.js
│   └── batch_note_gen.js
├── data/
│   ├── raw/
│   │   ├── Customer Job History.csv      ← 51K rows
│   │   ├── customers-2026-06-02.csv      ← 15K CF contacts
│   │   └── prospects-2026-05-23.csv      ← 5K prospects
│   ├── samples/
│   │   ├── Customer Job History-sample.csv
│   │   └── prospects-sample.csv
│   └── exports/
│       ├── unmatched_sites_455.json
│       ├── export_Customer_Notes.csv
│       ├── export_Matching_Exceptions.csv
│       ├── customer_notes_latest.tsv
│       └── (other SM8/data export CSVs/TSVs)
```
