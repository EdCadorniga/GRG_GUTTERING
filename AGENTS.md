# AGENTS.md

## Project Context
This repository captures the requirements and delivery plan for the GRD Guttering / Katwill Services ServiceM8 automation work.

The primary source files are:
- Email Conversation with Kylie.txt
- Accepted quote email notification.pdf
- Quote opened email notification.pdf
- Customer Job History-sample.csv
- prospects-sample.csv

## Working Rules
1. Treat the conversation and attachments as the source of truth for scope and behavior.
2. Use the sample CSVs as the working schema references.
3. Do not assume The Customer Factor has an API.
4. Keep historical job data safe and reviewable before writing to ServiceM8.
5. Cancel PDF approach - notes on existing SM8 companies only.
6. Quote-open tracking: redirect bridge or separate quoting tool.
7. Preserve auditability.
8. Handle duplicate rows defensively.

## AGENT EXECUTION RULES (TOKEN EFFICIENCY)
- **Reasoning Budget**: Max 3 reasoning steps per tool invocation.
- **Direct Execution**: Call MCP tools immediately when they match intent.
- **No Self-Reflective Loops**: No sanity checks on completed outputs unless structural error.
- **Concise Planning**: One sentence before formatting tool block.
- **Mandatory Repomix Read**: READ repomix-output.md FIRST in every conversation.
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

### Data Table IDs
| Table | ID | Backing Postgres Table |
|-------|-----|------------------------|
| stg_job_history (46 cols) | wFGBDqBfhBF7aTfr | data_table_user_wFGBDqBfhBF7aTfr |
| stg_prospects (22 cols) | 054q2ardHjYv1yE5 | data_table_user_054q2ardHjYv1yE5 |
| **stg_cf_contacts (45 cols)** | **Ki0oGme1ckXRGZtP** | data_table_user_Ki0oGme1ckXRGZtP |
| grd_sm8_client_uuids (8 cols) | zSTAdsGxNzi1a4or | data_table_user_zSTAdsGxNzi1a4or |
| grd_note_upload_log (5 cols) | 8tEfzXuwTSE793Xk | data_table_user_8tEfzXuwTSE793Xk |
| canonical_job_history | gE5K70r1k0eTyHOo | data_table_user_gE5K70r1k0eTyHOo |
| canonical_prospects | lDksvkIAticx7Jh5 | data_table_user_lDksvkIAticx7Jh5 |

### Workflow IDs — Current State

#### Active (kept)
| Workflow | ID | Status |
|----------|----|--------|
| GRD_HistoricalJobHistory_Ingest | 8mLRB5VpBKisvsUU | Active — ingest source of truth |
| GRD_Prospects_Ingest | QAOmPf3a4dpBeQ61 | Active — ingest source of truth |
| GRD_Match_CSV_to_SM8 (v3) | 7kEUmyDsb8TFYizO | Active — exact matching only (no fuzzy) |
| GRD_Note_Generate_Batch | KJA8xCVC1ajwBDit | Active — Postgres IN filter, 50/batch |
| GRD_Note_Upload_Batch | ipD5QpBO7ffBHPEK | Active — manual + 5min schedule, 50/run |
| GRD_ServiceM8_Duplicate_and_Placeholder_Notes_Cleanup | QFFLC3wOzQOynhas | Active — every 10 min, paginates via `$skip`/`$top`, DELETE via `note.json/{uuid}`, deletes up to 20/run |
| **GRD_CF_Contacts_Ingest** | **tJhlMwIiaPRYtDp5** | Active — webhook trigger, extracts CSV → normalizes columns → upserts to stg_cf_contacts |
| **GRD_CF_Match_to_UUID** | **BNcVsucXZc9c0oyk** | Draft — manual trigger, reads CF contacts + SM8 UUIDs → exact name match → upserts matched rows to grd_sm8_client_uuids |
| **GRD_CustomerSites_Generate** | **IMj5uhFkElJWDcv5** | Active — manual trigger, reads CF contacts + SM8 UUIDs → Code v2 (runOnceForAllItems) → Google Sheets append (1,647 rows written to Customer Sites tab) |
| **GRD_Set_Approval_Validation** | **QkNVzlIMWM5nUbEq** | Draft — manual trigger, HTTP Request → Google Sheets API batchUpdate to set Approval_Status dropdown on column F |
| **GRD_RJS_Sites_Append** | **aoNiAnCCsCTkZWLu** | Active — manual trigger, reads `rjs_sites` Data Table → Clear Sheet → Filter → Append to Customer Sites tab (3,997 rows) |

#### Archived Previously (38 workflows)
All 38 stale/superseded/draft/test GRD workflows archived. Full list includes: GRD_ReviewWorkbook_Init, GRD_CSV_to_Sheet_JobHistory, GRD_CSV_to_Sheet_Prospects, GRD_Query_ServiceM8_v3, GRD_Note_Generate (old), GRD_Note_Upload (old), GRD_Note_Upload_v2, GRD_QuoteNotifications, GRD_Note_Generate (stale copy), GRD_Note_Upload_Batch (draft), GRD_Match_CSV_to_SM8 (draft), GRD_CustomerSites_Generate (old), GRD_CustomerSites_Generate (draft 2), GRD_CustomerSites_Create, GRD_CustomerSites_Create (draft), GRD_Diagnostic_Count, GRD_Query_ServiceM8_Sites, GRD_Setup_SharedDir, GRD_Query_ServiceM8_Companies, Test Find Katwill, Test Create Note, Test PG Tables, plus 17 other stale/superseded/draft workflows.

### Workflow Audit Summary (Jun 2026)
- **Goal**: Audit + archive unnecessary GRD workflows; fix GRD_ServiceM8_Note_Cleanup
- **38 candidates identified** for archiving
- **27 archived** via MCP tools; **11 more archived** via direct REST API (`POST /api/v1/workflows/{id}/archive`) — all 38 complete
- **GRD_QuoteNotifications** archived by mistake — needs manual unarchive via n8n UI
- **GRD_ServiceM8_Note_Cleanup** fixed: replaced Manual Start → weekly schedule → every 10 min; fixed DELETE endpoint (`dbonote/{uuid}` → `note.json/{uuid}`); fixed pagination (cursor → `$skip`/`$top`, removed `executeOnce`); removed ineffective OData `$filter`; activated. Execution 20023: paginated successfully, deleted 5 placeholder notes (HTTP 200).
- All duplicate active cleanup workflow (LZqT3RDuegolaHq8) deactivated

### CF Contacts Ingest & Matching (Jun 2026)

#### What was done
- Received customer export CSV from Customer Factor (`customers-2026-06-02.csv`): 15,080 rows, 3,968 unique customer names, 45 columns
- CSV had variable-length rows (embedded newlines + trailing field variance); pre-processed with Python `fix_csv.py` to normalize before upload
- Created data table `stg_cf_contacts` (Ki0oGme1ckXRGZtP, 45 cols) matching the CF CSV schema
- Built **GRD_CF_Contacts_Ingest** (tJhlMwIiaPRYtDp5): webhook → ExtractFromFile → HTTP Request to batch-upsert via REST API (16 batches of ~940 rows each). Execution #20309: success, all 15K rows in Postgres.
- Built **GRD_CF_Match_to_UUID** (BNcVsucXZc9c0oyk): manual trigger → DataTable read (stg_cf_contacts + grd_sm8_client_uuids) → Code node (exact name match using lowercased `customer_name`) → DataTable upsert to grd_sm8_client_uuids
- Execution #21096: success, **1,647 CF customer names matched** to existing SM8 company UUIDs (out of 3,968 unique = 41% match rate)
- All matched rows upserted into `grd_sm8_client_uuids` with `source_table = "cf_contacts"` and populated email/phone from CF data

### Customer Sites Generation (Jun 2026)

#### What was done
- Built **GRD_CustomerSites_Generate** (IMj5uhFkElJWDcv5): ManualTrigger → Read CF Contacts → Read SM8 UUIDs (filter cf_contacts) → Merge (append) → Join & Format (Code v2, `runOnceForAllItems`) → Google Sheets Append Rows
- Fixed Code node version 2.1 → 2, added `mode: runOnceForAllItems`
- Fixed Google Sheets sheetName lookup: `mode: 'list'` → `mode: 'name'`
- Site_Name: trimmed `Company_Name` so whitespace-only falls through to `Customer_Name`
- Site_Phone: `cleanPhone()` strips placeholders, formats Australian numbers to `+61 X XXXX XXXX`, prefixes with `'` to prevent Google Sheets formula errors
- Phone priority: Mobile_Phone → Home_Phone → Work_Phone → Alt_Phone → UUID table phone → cleaned
- Removed Clear Sheet and Wait nodes to avoid 429 rate limit — user manually clears sheet when needed
- Sequential path: J&F → Append Rows (no parallel connections)
- **Execution #21403**: succeeded, 1,647 rows written with correct `'+61` phones and headers auto-created by n8n append
- Built **GRD_Set_Approval_Validation** (QkNVzlIMWM5nUbEq): ManualTrigger → HTTP Request (Google Sheets API batchUpdate) to set Approval_Status dropdown on column F
- Fixed: JSON body had extra `}` brace causing `parseJsonParameter` failure; credential key must be `googleSheetsOAuth2Api` for `predefinedCredentialType` mode
- **Execution #21426**: succeeded, dropdown applied to Customer Sites sheet (options: Approved, Needs Review, Rejected, Pending)

#### Known issues & constraints
- **~2,321 names remain unmatched** — need Id-chain fallback matching (CF Id → JH/PR Id → customer_name → UUID)
- Some CF customer names are identical to JH/PR names but stored with different casing; Code node lowercases both sides for matching
- `sm8_site_uuid` is null for all matched rows — site matching is the next step
- Several duplicates exist in CF data (same customer has multiple rows with different Ids/addresses) — e.g., "Fiona Watts" appears with both `id:2494` and `id:568`

#### Key source files
- `customers-2026-06-02.csv`: Raw CF contacts export (source)
- `customers_fixed.csv`: Normalized CSV (generated by `fix_csv.py`)
- `fix_csv.py`: Python script that re-normalized column names and padded variable-length rows
- `Customer Job History.csv`: 51K-row JH CSV (same CF `Id` column as golden key)
- `prospects-2026-05-23.csv`: 5K-row prospects (same CF `Id` column)

#### Next steps
1. **(Blocked)** Id-chain fallback matching for ~2,321 unmatched CF names — join CF `Id` → JH/PR `Id` → JH/PR `Customer_Name` → lookup UUID
2. Generate Customer Sites review sheet rows for the Google Sheet "Customer Sites" tab (gid=2101739941)
3. Build site creation workflow: approved rows → POST to `/api_1.0/company.json` with `parent_company_uuid`
4. For unmatched customers with no SM8 company: create new SM8 companies first

### Known Issues
- `$credentials` NOT available in n8n Code nodes (sandboxed). Use HTTP Request node with OAuth2 credential instead.
- Data Table Insert node broken — use REST API workaround.
- For updating existing n8n workflows, prefer the direct REST API path (`n8n_patcher.py` / `/api/v1/workflows`) over MCP SDK update calls; it has been more reliable for preserving credentials and avoiding stray draft copies.
- **Use ONLY `n8n_katwill_*` MCP tools** for n8n access. Do not use `n8n_lt_*` or `n8n_mcp_*` tools.
- ServiceM8 HTTP Request nodes can use the `GRD GUTTERING APP` OAuth2 credential (`9xTqnOrjPITTQoxc`).
- companysite.json is NOT a real ServiceM8 endpoint.
- ServiceM8 API base URL is `/api_1.0` not `/api`. Note endpoint: `POST /api_1.0/note.json` with `related_object: "company"`.
- Direct Postgres queries on Data Table backing tables return NULL for most data columns. Data appears stored in n8n internal format (JSONB). Use Data Table node for reads when possible.
- SM8 companycontact.json has <1% email/phone coverage — email/phone fallback matching largely ineffective.
- Code node output truncation (1.5MB limit) prevents viewing full match/unmatch counts in n8n UI.
- n8n Code nodes: double-quote SQL identifiers require `String.fromCharCode(34)` workaround. `\"` escaping strips in SDK parse chain.
- HTTP Request node `jsonBody` parameter: must contain valid JSON with no extra/missing braces. One extra `}` caused `parseJsonParameter` failure (position 385).
- HTTP Request node with `predefinedCredentialType` mode: credential key in `credentials` object must match the credential type name (e.g. `googleSheetsOAuth2Api`), NOT the node interface key (`oAuth2Api`).
- `n8n_katwill_remote_update_workflow` `setNodeCredential` operation triggers MCP response schema validation error despite the underlying update succeeding. Use legacy `n8n_katwill_update_workflow` for credential assignment.
- For creating workflows that need `availableInMCP: true`, use `n8n_katwill_remote_create_workflow_from_code` (it sets the flag automatically). The legacy `n8n_katwill_create_workflow` does NOT set this flag.

### Matching Results
- **Full run**: 1,925 exact matches out of ~11K unique customer names
- **By source**: 1,893 JH-only, 6 Prospects-only, 26 in both tables
- **Match rate**: 17.4% of unique customers matched to SM8 companies (exact name only)
- **Unmatched**: ~9,149 names — stored in Matching Exceptions sheet for manual review
- No fuzzy matching (Dice coefficient) in final run — removed to prevent runner timeout with 51K rows

### Note Generation Results (Final)
- **Clean slate**: All old placeholder notes and consolidated notes deleted. Re-generated from scratch.
- **1,712 notes with Job History** — formatted with 8 columns: Date, Type, Location, Qty, Each, Total, Inv#, Notes
- **180 notes with Quotes/Estimates** — Status, Details fields from Prospects table
- **202 "No records found"** — customers matched to SM8 but no JH/PR data in staging tables
- **0 placeholder rows** — completely eliminated
- **All 1,925 matched customers covered** — every customer has a note (data or "No records found")
- Note format: one consolidated note per customer with header row and formatted job records
- Fixed: `undefined` replaced with `-` in dates; 50K cell limit enforced with truncation
- `Job_location`, `Quantity`, and `Notes` columns ARE included (via SELECT * from Postgres)

### Note Upload Results
- **Current uploader**: `GRD_Note_Upload_Batch` (`ipD5QpBO7ffBHPEK`)
- Batching: 50 notes per run, 350ms interval between HTTP requests, 5 minute schedule + manual run
- Duplicate guard: `grd_note_upload_log` (`8tEfzXuwTSE793Xk`) stores one row per uploaded company UUID, and the note UUID is derived from that company UUID for retry safety
- OAuth endpoint confirmed: `POST https://api.servicem8.com/api_1.0/note.json` with `related_object: "company"`
- OAuth scope `publish_job_notes` required
- NOTE: Upload was performed BEFORE final clean regeneration. Notes will need re-upload if clean copies are desired.

### RJS Sites Merge & UUID Backfill (Jun 2026)

#### What was done
- Received RJS Cleaning site export: 2,399 unique addresses from CSV
- Built **GRD_RJS_Sites_Append** (`aoNiAnCCsCTkZWLu`): ManualTrigger → Clear Sheet → Get RJS Sites (Data Table) → Append to Sheet
- Merged RJS data with existing Customer Sites tab by `Site_Address` dedup key
- **3,997 unique addresses** after merge (all 2,399 RJS addresses already existed in sheet; RJS Site_Name preferred on match)
- Fixed `columns.schema` error on Append node (added schema array)
- Switched from MCP HTTP upload (wrong tool name/token audience) to REST API (`POST /api/v1/data-tables/{id}/rows`)
- Backfilled **1,897 missing UUIDs** by matching RJS `Customer_Name` against `grd_sm8_client_uuids` (lowercased exact match)
- **Final state**: 3,542 rows with UUID, 455 unmatched — saved to `unmatched_sites_455.json`
- Workflow uses Data Table `rjs_sites` (latest id: `5YEAz1SyFc0Y4bxS`)
- **Phone fix (Jun 2026)**: 1,599 phone numbers missing `'` prefix were fixed (formula errors in Google Sheets). Script: `fix_phones.py`.
- **Approval_Status dropdown re-applied (Jun 2028)**: `GRD_Set_Approval_Validation` executed successfully — column F dropdown (Approved, Needs Review, Rejected, Pending) re-applied after sheet rewrite.

#### Known issues & constraints
- 455 Customer Sites rows remain unmatched — names in Customer Factor but absent from SM8 UUID table (no SM8 company exists yet)
- Some RJS `Customer_Name` values are company entities (e.g. "AAI Limited T/A GIO") that won't match individual customer names
- Phone numbers stored with `'` prefix (text format) in Google Sheet
- RJS data has no `Customer_UUID`; UUIDs only come from CF→SM8 matching
- Unmatched rows saved to `unmatched_sites_455.json`

### Full Project Roadmap
1. Done - Ingest workflows
2. Done - Review workbook init
3. Done - CSV-to-Sheet workflows
4. Done - Query SM8 companies
5. Done - Ingest 2,455 SM8 companies
6. Done - Company sites checked
7. Done - Match CSV to SM8 UUIDs (1,925 exact matches, no fuzzy)
8. Done - Generate Notes (1,712 JH + 180 PR + 202 NoRec = all 1,925 covered)
9. Done - Upload Notes to SM8 (initial upload; re-upload needed for clean notes)
10. Done - Customer Sites tab (3,997 rows, 3,542 with UUID)
11. Not done - Quote notifications/bridge
12. Done - Additional columns: Job Location, Quantity, Notes in note content
13. Done - Clean up duplicate notes (clean slate regeneration completed)
14. Done - GRD_CF_Contacts_Ingest (15K rows ingested into stg_cf_contacts)
15. Done - GRD_CF_Match_to_UUID (1,647 CF names matched to SM8 UUIDs)
16. Done - RJS Sites merge + UUID backfill (1,897 new UUIDs matched)
17. **Not done** - Id-chain fallback matching for remaining 455 unmatched site rows
18. **Not done** - Site creation workflow (approved rows → SM8 API)
19. **Not done** - New SM8 company creation for unmatched names

### Key Source Files
- batch_upload.js: CSV batch upload script with column name mappings
- batch_note_gen.js: SDK code for GRD_Note_Generate_Batch workflow
- GRD_Match_CSV_to_SM8.js: SDK code for Matching Engine
- GRD_Note_Generate.js: SDK code for Note Generate v3
- GRD_Note_Upload_Batch.js: batch uploader source for approved notes to ServiceM8
- GRD_ServiceM8_Note_Cleanup.js: cleanup workflow source for duplicate and placeholder ServiceM8 company notes
- Customer Job History.csv: Source CSV (51,304 rows, 46 columns)
- prospects-2026-05-23.csv: Source CSV (5,281 rows, 22 columns)
- customers-2026-06-02.csv: Raw CF contacts export (15,080 rows, 45 columns)
- customers_fixed.csv: Normalized CF CSV (generated by fix_csv.py)
- fix_csv.py: Python script that re-normalized column names and padded variable-length rows
- unmatched_sites_455.json: 455 Customer Sites rows without SM8 UUIDs (needs company creation or manual review)
