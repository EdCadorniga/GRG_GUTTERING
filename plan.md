# Plan

## Current State
- The repository docs are aligned with the GRD Guttering / Katwill Services scope.
- Sample CSV references exist as `Customer Job History-sample.csv` and `prospects-sample.csv`.
- n8n workflows exist for:
  - historical job staging
  - prospect staging
  - review workbook initialization
  - quote notifications
- The remaining work is the review-sync and ServiceM8 writeback path.

## Done
- Copied the working `.env` into the repo root and ignored it in git.
- Connected this workspace to `origin` on GitHub and pushed the repo.
- Added `AGENTS.md` rules for this project, including token-efficient execution guidance.
- Replaced the large CSV references with compact sample CSVs.
- Created n8n workflows:
  - `GRD_HistoricalJobHistory_Ingest`
  - `GRD_Prospects_Ingest`
  - `GRD_ReviewWorkbook_Init`
  - `GRD_QuoteNotifications`

## Next Steps
1. Build the Google Sheets review-sync workflow so canonical rows are written into the GRD workbook tabs.
2. Build the approval readback workflow that reads `Approved` rows and writes them to ServiceM8.
3. Add matching and dedupe logic to the canonical review layer before any ServiceM8 write.
4. Validate a small sample batch end to end from ingest to workbook to writeback.
5. Only after sample validation, run the full import batches.

## Working Decisions
- Raw CSVs are staged in Postgres before any ServiceM8 write.
- Google Sheets is only the human review surface.
- ServiceM8 writes only happen after approval.
- Historical job history and prospect records are stored as attachments/PDFs first.
- Quote open detection uses an n8n redirect/tracking bridge.
- Matching uses exact email, then exact phone, then normalized name plus normalized street address.
- Duplicate source rows are handled defensively and must remain idempotent across reruns.

## Risks To Manage
- A bad match could attach history to the wrong customer, so review gates remain mandatory.
- Duplicate rows are common in both CSVs, so all writes need stable keys.
- Quote-open tracking depends on the redirect bridge staying in front of the live quote URL.
- Workbook sync and writeback are still missing, so nothing should be treated as production-ready yet.
