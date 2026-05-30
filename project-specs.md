# Project Specs

## Purpose
Build a Postgres-backed import, review, and write pipeline for GRD Guttering / Katwill Services as they move customer records and quoting activity into ServiceM8.

## Background
The conversation with Kylie establishes these key points:
- The Customer Factor does not provide a conventional API for pulling historical data.
- Historical customer/job data is available as CSV exports.
- ServiceM8 is the destination system.
- Historical job data should be reviewed before anything is finalized in ServiceM8.
- Quote history and quote status notifications are important operational signals.
- The team prefers ServiceM8 proposals and quotes, with custom handling for both proposal-style and PDF quote workflows.
- Quote-open tracking is not a native ServiceM8 feature, so the implementation needs an approved workaround.

## Source Files Reviewed
- `Email Conversation with Kylie.txt`
- `Customer Job History.csv`
- `prospects-2026-05-23.csv`
- `Accepted quote email notification.pdf`
- `Quote opened email notification.pdf`

## Data Observations
### Customer Job History
- 24,870 rows
- 4,882 unique IDs
- 3,782 duplicated IDs
- Many repeated rows per customer ID
- Contains address, contact, notes, job details, and a `Job location` field that appears suitable for ServiceM8 site creation or matching

### Prospects
- 5,272 rows
- 4,197 unique IDs
- 775 duplicated IDs
- Contains prospect contact data, status, estimate information, and estimate location

### Quote Open Notification Example
The PDF shows a notification that includes:
- Customer name
- Quote number
- That the quote was opened/reviewed
- Number of times viewed
- Customer contact details
- A recommendation to wait about 10 minutes before following up

### Quote Accepted Notification Example
The PDF shows a notification that includes:
- Customer name
- Quote number
- Accepted work summary
- Accepted total
- Service location
- Scheduling guidance

## Functional Requirements
### 1. Historical Job History Import
Import `Customer Job History.csv` into ServiceM8 in a way that preserves historical job context.

Requirements:
- Ingest raw CSV rows into Postgres first, then derive reviewable canonical rows from staging.
- Match each source row to the correct ServiceM8 customer using deterministic rules.
- Support a preflight review step before committing records.
- Preserve job location data, because it may be used to create or update ServiceM8 sites.
- Store the imported history as attachments/PDFs first, not timeline notes, unless a future requirement explicitly changes that decision.
- Flag ambiguous or unmatched rows for manual review.
- Avoid duplicate writes when the same source row is processed more than once.

### 2. Prospect Import
Import `prospects-2026-05-23.csv` into ServiceM8.

Requirements:
- Ingest raw CSV rows into Postgres first, then derive review rows for approval.
- Match prospects to the correct customer or prospect record in ServiceM8.
- Preserve prospect notes, estimate information, and status.
- Store prospect history as attachments/PDFs first, not timeline notes, unless a future requirement explicitly changes that decision.
- Flag duplicates and unmatched records.

### 3. Job Location Handling
The source data contains job location information that should be usable for ServiceM8 site creation or site updates.

Requirements:
- Map job location data consistently.
- Prefer deterministic matching rules, not fuzzy matching unless manually approved.
- Keep a review log of any site that cannot be mapped confidently.

### 4. Quote Open Notification
When a customer opens a quote, send an email notification that matches the intent of the attached example.

Requirements:
- Include quote identifier and customer identity.
- Include the fact that the quote was opened and how many times it has been viewed.
- Include customer contact details if available.
- Trigger as early as possible after the first view.
- If ServiceM8 cannot natively detect quote opens, use an n8n redirect/tracking bridge that logs the open event before forwarding the customer to the live quote.

### 5. Quote Accepted Notification
When a customer accepts a quote, send an email notification that matches the intent of the attached example.

Requirements:
- Include quote identifier and customer identity.
- Include accepted work details.
- Include total accepted amount.
- Include service location.
- Include a scheduling prompt or next-step instruction.

## Storage and Presentation Rules
- Prefer attachments/PDFs for long historical records to keep the main customer timeline uncluttered.
- If notes are used, keep them short and structured.
- Keep imported content human-readable and clearly labeled with source and date.

## Implementation Architecture
### System Of Record
- Postgres is the source of truth for raw CSV staging rows, canonical review rows, approval state, write attempts, and audit logs.
- Google Sheets is the human review surface only.
- ServiceM8 is the destination system for final customer records, sites, attachments, notes, and quote notifications.
- n8n orchestrates ingestion, matching, approvals, and ServiceM8 writes.

### Review Workflow
- Each source file is imported into a raw staging table in Postgres.
- A canonical review table is generated from staging and synchronized to Google Sheets.
- The workbook should use separate tabs for job history, prospects, matching exceptions, and write logs.
- Reviewers set a workflow status such as `Pending`, `Approved`, `Rejected`, or `Fix Needed`.
- n8n reads back approved rows from Postgres and writes only those rows to ServiceM8.
- Every state change is logged with the source row identifier, match decision, and write outcome.

### Matching Rules
Recommended matching order:
1. Exact email address.
2. Exact phone number.
3. Normalized name plus normalized street address.

If a row has multiple plausible targets or no confident target, it remains blocked for manual review instead of being written automatically.

## Deduplication Rules
- Duplicate source rows are handled defensively by using a combination of source-file identity, source row content, and deterministic matching keys.
- Re-running the same batch must not create duplicate ServiceM8 records or duplicate attachments.
- Ambiguous matches must be surfaced for review before any write action.

## Non-Functional Requirements
- Idempotent imports
- Audit trail for every processed row
- Clear error reporting
- Minimal manual cleanup
- Safe handling of large CSVs
- No destructive overwrites without review

## Risks
- The source data contains duplicates and repeated IDs.
- Some rows may not map cleanly to a ServiceM8 customer.
- Quote-open tracking may require a workaround if ServiceM8 is the only quote platform.
- Notes-based imports could clutter ServiceM8 if they are not formatted carefully.
- A bad match rule could attach history to the wrong customer, so review gates are mandatory before writes.

## Acceptance Criteria
- A reviewer can see which rows were imported, skipped, matched, or flagged.
- A sample batch can be validated before the full migration runs.
- Job history and prospect data are visible in ServiceM8 in a usable form.
- Quote-open and quote-accepted notifications are delivered in the expected format.
- The implementation can be re-run without duplicating records.
- The review log shows what matched, what was rejected, what was fixed, and what was written to ServiceM8.
