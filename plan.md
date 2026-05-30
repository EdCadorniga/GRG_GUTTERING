# Plan

## Status
Implementation is partially complete. The repository now reflects a Postgres-first, Google Sheets review, n8n-orchestrated workflow with ServiceM8 as the write target and an n8n redirect bridge for quote-open tracking.

## Current Decisions
- Raw CSVs are staged in Postgres before any ServiceM8 write.
- Google Sheets is only the human review surface.
- ServiceM8 writes only happen after approval.
- Historical job history and prospect records are stored as attachments/PDFs first.
- Quote open detection uses an n8n redirect/tracking bridge.
- Matching uses exact email, then exact phone, then normalized name plus normalized street address.
- Duplicate source rows are handled defensively and must remain idempotent across reruns.

## Implemented Workflows
- `GRD_HistoricalJobHistory_Ingest` stages historical job history CSV uploads into Postgres.
- `GRD_Prospects_Ingest` stages prospect CSV uploads into Postgres.
- `GRD_ReviewWorkbook_Init` creates the GRD review workbook with tabs for job history, prospects, matching exceptions, and write logs.
- `GRD_QuoteNotifications` logs quote open and accepted events, sends internal Outlook notices, and redirects quote-open clicks.

## Phase 1: Staging And Review Model
- Define raw staging tables for the two CSV sources.
- Define canonical review tables with source row IDs, match candidates, status, and write outcome fields.
- Define the Google Sheets tabs for job history review, prospect review, matching exceptions, and write logs.
- Define the review status lifecycle: `Pending`, `Approved`, `Rejected`, `Fix Needed`.

## Phase 2: Matching And Dedupe
- Implement deterministic customer matching in the order documented in `project-specs.md`.
- Normalize names, phone numbers, email addresses, and street addresses for matching.
- Detect duplicate source rows using file identity, source row content, and stable match keys.
- Surface ambiguous matches for manual review instead of guessing.

## Phase 3: Historical Job Import
- Parse `Customer Job History.csv` into raw staging rows.
- Generate reviewable canonical job-history rows.
- Preserve job location as a site candidate or site update field.
- Write approved rows to ServiceM8 as attachments/PDFs and record the write log.

## Phase 4: Prospect Import
- Parse `prospects-2026-05-23.csv` into raw staging rows.
- Generate reviewable canonical prospect rows.
- Preserve estimate information, status, notes, and estimate location.
- Write approved rows to ServiceM8 as attachments/PDFs and record the write log.

## Phase 5: Quote Notifications
- Implement quote-open tracking through a redirect bridge that logs the open before forwarding to the live quote.
- Implement the quote-accepted notification path with accepted work summary, total, and service location.
- Keep the notification copy aligned with the attached reference PDFs.

## Phase 6: Verification
- Run a small sample batch from each CSV first.
- Confirm row counts, duplicates, and status transitions in Postgres and Sheets.
- Confirm matched rows map to the intended ServiceM8 records.
- Confirm unresolved rows stay blocked.
- Re-run the same batch and confirm no duplicate ServiceM8 writes occur.
- Run `GRD_ReviewWorkbook_Init` once to create the shared workbook, then wire future review-sync workflows to the returned spreadsheet ID.

## Phase 7: Rollout
- Process the approved full batch.
- Keep audit logs for imported, matched, skipped, rejected, and fixed rows.
- Document the operator steps for future re-runs and new CSV drops.
