# Project Specs

## Purpose
Build a Postgres-backed import, review, and write pipeline for GRD Guttering / Katwill Services as they move customer records and quoting activity into ServiceM8.

## Background
The source conversation establishes these key points:
- The Customer Factor does not provide a conventional API for pulling historical data.
- Historical customer/job data is available as CSV exports.
- ServiceM8 is the destination system.
- Historical job data should be reviewed before anything is finalized in ServiceM8.
- Quote history and quote status notifications are important operational signals.
- The team prefers ServiceM8 proposals and quotes, with custom handling for both proposal-style and PDF quote workflows.
- Quote-open tracking is not a native ServiceM8 feature, so the implementation needs an approved workaround.

## Source Files Reviewed
- `Email Conversation.txt`
- `Customer Job History.csv`
- `prospects-2026-05-23.csv`
- `Accepted quote email notification.pdf`
- `Quote opened email notification.pdf`

## Environment

### n8n Instance
- URL: `http://localhost:5679`
- Project: `HfMlqgFS6NFMj6hI` ("Automations Server <admin@sm8setup.com.au>")
- MCP Integration Gateway: `http://mcp-servicem8:3000`

### Credentials
| Name | Type | ID | Used By |
|------|------|----|---------|
| Google Sheets account | googleSheetsOAuth2Api | `SnkZZEvybquPKY8P` | Review workbook init, writeback workflows |
| GRD GUTTERING APP | oAuth2 (ServiceM8) | `9xTqnOrjPITTQoxc` | Direct ServiceM8 API calls (companies, notes, etc.) |
| Katwill ServiceM8 Credentials account | serviceM8CredentialsApi | `K9hkbJn20IjLJ8bg` | MCP gateway tools via `mcp-servicem8:3000` |
| Postgres account | postgres | `G7OkQFeCA5TcNofu` | All data table operations |
| VPS Caddy SSH | sshPrivateKey | `XwN2JVjbC2hesER8` | Host-level file operations via SSH |

### ServiceM8 Scopes (GRD GUTTERING APP)
manage_jobs, create_jobs, read_jobs, manage_job_contacts, manage_customer_contacts, manage_customers, manage_attachments, read_attachments, read_inbox, publish_inbox, publish_job_attachments, read_job_attachments, read_job_queues

### ServiceM8 Rate Limits
- 180 requests per minute
- 20,000 requests per day per addon per account

### Review Workbook
- URL: `https://docs.google.com/spreadsheets/d/19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y/edit`
- Sheet ID: `19CU-Ud4KGSZQtkvZoENvXen95R-7T1xRisY3aTH6j9Y`
- Required tabs: "Job History Review", "Prospects Review", "Matching Exceptions", "Write Log", "Customer Sites"

### VPS / Caddy / Shared Storage
- **VPS Host**: `46.250.242.79`, SSH as `root` via `vps_caddy_key` (passphrase `PASSPHRASE_FOR_ED` from `.env`)
- **Shared mount**: `/opt/dpk/shared` (host) = `/srv` (inside n8n and Caddy containers)
- **GRD directory**: `/opt/dpk/shared/grd/` accessible at `/srv/grd/` in containers, served at `https://caddy.katwillservices.com.au/grd/`
- **Full CSVs**: `Customer Job History.csv` (11 MB, 24,870 rows) and `prospects-2026-05-23.csv` (1.1 MB, 5,272 rows) on VPS
- **Caddy**: serves `/srv/*` with `file_server browse`
- **n8n file writes**: use `/srv/grd/<path>`. n8n restricted to `/srv/` via `N8N_RESTRICT_FILE_ACCESS_TO`.
- **SSH**: `VPS Caddy SSH` (`XwN2JVjbC2hesER8`) credential. For programmatic SFTP: `paramiko.Ed25519Key.from_private_key_file()`.

## Data Tables (n8n Data Table Nodes)

### Staging Tables (raw CSV import targets)
| Table | ID | Columns |
|-------|----|---------|
| `stg_job_history` | `4CdagVdK1MZvofM5` | 46 columns |
| `stg_prospects` | `Ncw03CMuHVt9o7fE` | 22 columns |

### Canonical Tables (review/write layer)
| Table | ID | Description |
|-------|----|-------------|
| `canonical_job_history` | `gE5K70r1k0eTyHOo` | Derived from stg_job_history with matching state |
| `canonical_prospects` | `lDksvkIAticx7Jh5` | Derived from stg_prospects with matching state |
| `grd_mapping` | (not yet created) | Postcode/region mapping for GRD-specific areas |
| `grd_sm8_client_uuids` | `zSTAdsGxNzi1a4or` | Lookup: customer_name to ServiceM8 company UUID |

### grd_sm8_client_uuids Schema
| Field | Type | Description |
|-------|------|-------------|
| `customer_name` | string | CSV customer/prospect name (match key) |
| `sm8_company_uuid` | string | ServiceM8 company UUID |
| `sm8_site_uuid` | string | Site UUID if multi-site, else null |
| `site_address` | string | Full site address string |
| `source_table` | string | `job_history` or `prospects` |
| `ingested_at` | date | Timestamp of ServiceM8 query |

### Canonical Table Schemas (additional fields beyond staging columns)
Both canonical tables extend their staging schema with:
| Field | Type | Description |
|-------|------|-------------|
| `service_uuid` | string | ServiceM8 UUID after successful write |
| `match_status` | string | unmatched, matched, ambiguous, excluded |
| `match_method` | string | Which rule matched |
| `matched_service_uuid` | string | ServiceM8 UUID of the matched customer |
| `approval_status` | string | pending, approved, rejected, fix_needed |
| `staging_id` | string | FK to source staging table row |
| `ingested_at` | date | When the canonical row was created |
| `write_status` | string | not_attempted, written, failed, skipped |
| `write_attempts` | number | Retry counter |
| `last_match_attempt` | date | Timestamp of last matching attempt |

### stg_job_history Columns (46)
`Id`, `Customer_Name`, `Company_Name`, `Salutation`, `First_Name`, `Last_Name`, `Street_Number`, `Street_Name`, `Address_2`, `City`, `Province`, `Postal_Code`, `Home_Phone`, `Work_Phone`, `Mobile_Phone`, `Fax`, `Alt_Phone`, `Alt_Contact`, `Email`, `Notes`, `Marketing_Method`, `Date_Added`, `Star_Rating`, `Customer_Type`, `Height`, `Roof_Type`, `Service_Required`, `Additional_Services`, `Send_Preference_Email`, `Send_Preference_Text`, `Tags`, `Job_Date`, `Job_Type`, `Job_Details`, `Quantity`, `Each`, `Price`, `Assigned_To`, `Duration`, `Job_location`, `Travel_Time_in_hrs`, `Job_Time_in_hrs`, `Invoice_Number`, `Estimate_Information`, `Status`, `Estimate_Location`

### stg_prospects Columns (22)
`Id`, `Prospect_Name`, `Company_Name`, `Salutation`, `First_Name`, `Last_Name`, `Street_Address`, `Address_2`, `City`, `Province`, `Postal_Code`, `Home_Phone`, `Work_Phone`, `Mobile_Phone`, `Fax`, `Email`, `Marketing_Method`, `Date_Added`, `Tags`, `Estimate_Information`, `Status`, `Estimate_Location`

## n8n Workflows

| Workflow | ID | Status | Description |
|----------|----|--------|-------------|
| `GRD_HistoricalJobHistory_Ingest` | `8mLRB5VpBKisvsUU` | Done | Ingests CSV rows into stg_job_history |
| `GRD_Prospects_Ingest` | `QAOmPf3a4dpBeQ61` | Done | Ingests CSV rows into stg_prospects |
| `GRD_ReviewWorkbook_Init` | `7funGGIQPuhz7oNc` | Done | 20-node workflow: clears 4 sheet tabs, reads sample rows, appends |
| `GRD_CSV_to_Sheet_JobHistory` | `SRDwTsEWSzEgretk` | Done | Reads CSV from /srv/grd/, normalizes, appends to review sheet |
| `GRD_CSV_to_Sheet_Prospects` | `JDWrA1opB4kJCdhP` | Done | Reads CSV from /srv/grd/, normalizes, appends to review sheet |
| `GRD_Query_ServiceM8_v3` | `PUeETKtVNhSAGQmh` | Done | Queries active companies via GET /company.json with OAuth2 |
| `GRD_Match_CSV_to_SM8` | `gGTV3KlLo36BtZR4` | Created | Matches CSV customers to SM8 UUIDs via hash-join on name |
| `GRD_Customer_Sites` | `IXuYXU5D6i8edsvR` | Created | Deduplicates customer-site combos from grd_sm8_client_uuids |
| `GRD_Note_Generate` | - | Not built | Generates consolidated Notes per customer |
| `GRD_Note_Upload` | - | Not built | Uploads Notes to ServiceM8 via POST /note.json |
| `GRD_QuoteNotifications` | - | Stub | Quote status notification workflow |
| `GRD_QuoteOpenBridge` | - | Not built | Redirect/tracking link for quote-open detection |
| `scenario_email_ai_servicem8` | `sJjQ3lFOXmzyCefLqxzvN` | Reference | Existing MCP gateway tool patterns |

### MCP ServiceM8 Tool Patterns (from reference workflow)
The MCP gateway at `http://mcp-servicem8:3000` exposes these ServiceM8 tools:
- `servicem8_createJobAllocations`, `servicem8_listJobs`, `servicem8_listStaffMembers`
- `servicem8_listJobAllocations`, `servicem8_listJobActivity`, `servicem8_listJobSteps`
- `servicem8_listInvoices`, `servicem8_listJobMaterials`, `servicem8_createJobContact`
- `servicem8_updateJob`

For direct ServiceM8 API calls, use `GRD GUTTERING APP` OAuth2 credential with REST endpoints.

## Google Sheet Review Workbook Tabs

### Tab: "Job History Review"
Headers: all stg_job_history columns + `Approval_Status` + `Review_Notes`

### Tab: "Prospects Review"
Headers: all stg_prospects columns + `Approval_Status` + `Review_Notes`

### Tab: "Matching Exceptions"
Headers: `Source_Table`, `Record_Id`, `Customer_Name`, `Match_Field`, `Match_Value`, `Issue_Description`, `Resolved`, `Resolution_Notes`

### Tab: "Write Log"
Headers: `Timestamp`, `Operation`, `Target_Entity`, `ServiceM8_UUID`, `Source_Table`, `Source_Record_Id`, `Status`, `Message`

### Tab: "Customer Sites"
Headers: `Customer_Name`, `ServiceM8_UUID`, `Site_Address`, `Site_UUID`, `Source_Table`, `Row_Count`

## ServiceM8 API Endpoint Mappings
| Entity | Endpoint | Key Fields |
|--------|----------|------------|
| Company | GET `/company.json` | Supports $filter, $limit, cursor pagination |
| CompanyContact | GET `/companycontact.json` | Same OData query pattern |
| Note | POST `/note.json` | company_uuid, note_text |
| Attachment | POST `/attachment.json` | related_object, related_object_uuid, attachment_source |
| Job | POST `/job.json` | - |
| ObjectSearch | GET `/objectsearch/{object}.json` | OData $filter, $limit |

## Implementation Status

### Done
- Repository documentation aligned with GRD/Katwill scope
- Compact sample CSVs created
- n8n workflows: HistoricalJobHistory_Ingest, Prospects_Ingest, ReviewWorkbook_Init, CSV_to_Sheet_JobHistory, CSV_to_Sheet_Prospects, Query_ServiceM8_v3, QuoteNotifications (stub), Match_CSV_to_SM8, Customer_Sites
- ServiceM8 OAuth2 custom app `GRD GUTTERING APP` created
- ServiceM8 API endpoints reviewed and tested
- Review workbook built with 5 tabs, populated with sample data
- GRD shared storage on VPS, full CSVs uploaded
- `grd_sm8_client_uuids` data table created (`zSTAdsGxNzi1a4or`)
- `GRD_Query_ServiceM8_v3` tested and working (returns 2,455 companies)
- All 2,455 companies ingested into `grd_sm8_client_uuids` via REST API batch POST
- `n8n_patcher.py` configured for GRD GUTTERING APP credential patching
- Phone normalization rules: AU format with spaces
- Address cleanup rules: Province normalization, city title-case, cross-row backfill
- Data cleanup pipeline defined
- Client Sites addon confirmed enabled
- **PDFs cancelled** -- replaced by Notes on existing ServiceM8 companies
- **No company/contact creation** -- query only, never write customers
- `n8n_patcher.py` is the credential configuration method for HTTP Request nodes
- `GRD_Match_CSV_to_SM8` (`gGTV3KlLo36BtZR4`) created — hash-join matching engine (not yet tested)
- `GRD_Customer_Sites` (`IXuYXU5D6i8edsvR`) created — dedup customer-site combos (not yet tested)

### In Progress
- (none — all created workflows built; pending workflows need to be written)

### Pending (ordered)
1. Test `GRD_Match_CSV_to_SM8` manually in n8n
2. Test `GRD_Customer_Sites` manually in n8n
3. `GRD_Note_Generate` -- one Note per matched customer
4. `GRD_Note_Upload` -- POST to ServiceM8 /note.json
5. `GRD_QuoteNotifications` -- build out stub
6. `GRD_QuoteOpenBridge` -- redirect/tracking link bridge
7. Sample batch validation
8. Full import

## Functional Requirements

### 1. Historical Job History Import
- Ingest raw CSV into Postgres, derive canonical rows
- Match source rows to ServiceM8 customers using name lookup
- Support preflight review before committing records
- Store as Notes on matched companies (not attachments/PDFs)
- Flag ambiguous/unmatched rows for manual review
- Idempotent across re-runs

### 2. Prospect Import
- Ingest into Postgres, derive review rows
- Match to ServiceM8 companies via name
- Preserve estimate info and status in Notes
- One Note per prospect company

### 3. Job Location Handling
- Map job location data consistently
- Deterministic matching rules (CSV name to SM8 company name)
- Multi-site customers handled via Client Sites addon

### 4. Quote Open Notification
- n8n redirect/tracking bridge if SM8 cannot natively detect opens
- Include quote identifier, customer identity, view count

### 5. Quote Accepted Notification
- Include quote identifier, customer identity, material item names from the ServiceM8 quote event, and total
- Display material item names only, one per line; omit descriptions, quantities, prices, and duplicate names
- Display `N/A` when no material item names are present
- Include scheduling prompt/next-step instruction

## Architecture

### System of Record
- **Postgres** (n8n Data Tables): source of truth for raw staging, canonical rows, audit logs
- **Google Sheets**: human review surface only
- **ServiceM8**: destination for Notes on existing companies
- **n8n**: orchestrates ingestion, matching, approval, and writes

### Review Workflow
1. CSV raw staging table (Postgres)
2. Staging canonical review table
3. Canonical Google Sheets tabs (sync)
4. Human reviews and sets status (Approved/Rejected/Fix Needed)
5. n8n reads back approved rows generates Notes for ServiceM8
6. Every state change logged

### Matching Rules
1. Exact customer name match against `grd_sm8_client_uuids`
2. CSV Customer_Name vs SM8 company name (case-insensitive)
3. Unmatched records flagged for manual review

## Key Decisions
- **PDFs cancelled** -- Notes replace PDFs entirely
- **No company/contact creation** -- query SM8 companies only
- **One note per customer** (consolidated), not one per row
- **Prospects** get Notes same as job history (estimate info, no Jobs)
- **Multi-site customers** get separate Client Site records
- **Customer Sites tab** maps Customer UUID to all Site addresses
- **Approval gate**: only Approved rows generate Notes
- Postgres (data tables) is source of truth; Google Sheets is review surface
- Matching priority: exact customer name vs grd_sm8_client_uuids
- `n8n_patcher.py` is the credential method (MCP setNodeCredential broken)
- Data table insert node broken -- use MCP add_data_table_rows or HTTP Request instead

## Known Issues
- Data table insert node does not populate columns regardless of mapping mode (fillIn, autoMapInputData, defineBelow). Workaround: use MCP add_data_table_rows API or HTTP Request directly.
- MCP setNodeCredential operation always returns schema validation error. Must use n8n_patcher.py to patch credentials at node root level.

## Workflow Config Pattern
Use **Set node (raw mode)** as a config block at the start of every workflow, referenced via `$node.Config.json.*` expressions:
- Spreadsheet ID, data table IDs, tab names, header arrays
- Column name mappings, approval column names
- Constants like `executeOnce: true` on data table reads
- Credential references as string IDs

This avoids Code node overhead and keeps config visible in the n8n UI.

## Google Sheets Append Pattern
Use **autoMapInputData: true** in Google Sheets append operations when field counts are large.

## Data Table Read Pattern
Set **executeOnce: true** on all data table read nodes in linear workflows to prevent item multiplication.

## Open Questions
1. Quote notifications: ServiceM8 native or separate quoting system?
2. Quote-open tracking: redirect bridge approach acceptable?

## Risks
- Source data contains duplicates and repeated IDs
- Bad match could attach history to wrong customer -- review gates mandatory
- Quote-open tracking depends on redirect bridge in front of live quote URL
- n8n data table insert node broken -- all row writes must use alternatives
- MCP setNodeCredential broken -- must use n8n_patcher.py
- ServiceM8 rate limits: 180 req/min, 20,000 req/day

## Acceptance Criteria
- [x] ServiceM8 companies queried and stored in grd_sm8_client_uuids (2,455 rows)
- [x] Match CSV names to SM8 UUIDs — workflow created, not yet tested
- [x] Customer Sites dedup — workflow created, not yet tested
- [ ] Notes generated with consolidated job history per customer
- [ ] Notes uploaded to ServiceM8 without duplicates
- [ ] Quote notifications deliver emails on sent status
- [ ] Quote-open tracking records views and notifies the team
- [ ] Full 24,870 job history + 5,272 prospect rows processed
