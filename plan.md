# Plan

## Current State
- Repository docs aligned with GRD Guttering / Katwill Services scope
- Sample CSVs exist
- n8n data tables created: stg_job_history, stg_prospects, canonical_job_history, canonical_prospects, grd_sm8_client_uuids
- ServiceM8 OAuth2 custom app created (id: 9xTqnOrjPITTQoxc)
- Ingest, CSV-to-Sheet, Review Workbook workflows built and tested
- GRD shared storage on VPS: /opt/dpk/shared/grd/ served at https://caddy.katwillservices.com.au/grd/
- Full CSVs uploaded: Customer Job History.csv (11 MB, 24,870 rows) and prospects-2026-05-23.csv (1.1 MB, 5,272 rows)
- GRD_Query_ServiceM8_v3 tested — 2,455 companies ingested into grd_sm8_client_uuids
- PDFs cancelled — Notes replace PDFs entirely
- companysite.json confirmed NOT a real endpoint; sites via parent_company_uuid (1 found)
- GRD_Match_CSV_to_SM8 v2 (7kEUmyDsb8TFYizO) — 12 nodes, reads from data tables, executed
- GRD_Note_Generate v3 (HDlRPvvWy5gTYwvc) — 9 nodes, reads data tables for JH/Prospects, executed
- GRD_Note_Upload (ZaAWgXvdHnolHidS) — 4 nodes, created but untested
- GRD_Customer_Sites (IXuYXU5D6i8edsvR) — tested, deduplicates unique customer-site combos
- Note: Google Sheets credentials auto-assigned wrong by SDK. Patched via MCP setNodeCredential (works now).
- () NOT available in n8n sandboxed Code nodes.
- MCP update_workflow setNodeCredential now works (previously had schema mismatch error).
- BCK: LOW MATCH RATE — exact name matching yields only 6 matches out of thousands.

## Done
- .env created and gitignored. GitHub origin connected, repo pushed.
- AGENTS.md with token-efficient guidance.
- Ingest, Prospect, Review Workbook, CSV-to-Sheet, Query SM8, Customer Sites workflows.
- ServiceM8 OAuth2 app with all required scopes.
- VPS shared storage, full CSVs uploaded.
- Google Sheets review workbook with 5+ tabs.
- ServiceM8 endpoints confirmed: company.json, companycontact.json, attachment.json, note.json, search/{object}.json.
- companysite.json confirmed NOT authorised (403).
- 2,455 companies ingested via n8n REST API batch POST.
- n8n_patcher.py modified for GRD.
- Old Matching Engine gGTV3KlLo36BtZR4 archived.
- New Matching Engine 7kEUmyDsb8TFYizO (data table reads) created and executed.
- Old Note Generate IDN1zxRG6M8TWBHg archived.
- New Note Generate HDlRPvvWy5gTYwvc (data table reads) created and executed.
- Credentials patched on both new workflows.

## In Progress
- Fixing customer matching — 6 matches from exact name match is too low.

## Next Steps (ordered)
1. IMPROVE MATCHING — fuzzy name matching + phone/email matching
2. Re-run Matching Engine with improved matching
3. Re-run Note Generate with matched customers
4. Test Note Upload with approved notes
5. Quote notifications + quote-open bridge
6. Sample validation > full import

## Acceptance Criteria
- [x] SM8 companies queried and stored (2,455 rows)
- [x] Match workflow built and executed
- [x] Customer Sites dedup tested
- [ ] Meaningful number of customers matched
- [ ] Notes generated with consolidated job history per customer
- [ ] Notes uploaded to SM8 without duplicates
- [ ] Quote notifications/bridge
- [ ] Full 24,870 + 5,272 rows processed

## Working Decisions
- PDFs cancelled -> Notes replace PDFs entirely
- No company/contact creation — query only
- One note per customer (consolidated), not one per row
- Prospects get Notes same as job history
- Multi-site customers get separate Client Site records
- Approval gate: only Approved rows generate Notes
- Postgres (data tables) is source of truth; Google Sheets is review surface
- Matching priority: exact customer name -> need fuzzy/phone/email
- n8n_patcher.py for ServiceM8 HTTP credentials; MCP update_workflow for GS credentials
- Data table insert node broken — use REST API instead
- companysite.json does NOT exist

## Risks
- Low match rate blocks entire pipeline
- Bad match could attach history to wrong customer
- Duplicate rows in CSVs
- SM8 rate limits: 180 req/min, 20,000 req/day

## Open Questions (need Kylie)
- Best matching strategy: fuzzy name, phone, email, or all?
- Quote notifications: SM8 native or separate system?
- Quote-open tracking: redirect bridge acceptable?
