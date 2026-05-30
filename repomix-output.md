This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where comments have been removed, empty lines have been removed, content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Empty lines have been removed from all files
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.gitignore
.repomixignore
Accepted quote email notification.pdf
AGENTS.md
Customer Job History-sample.csv
Email Conversation with Kylie.txt
plan.md
project-specs.md
prospects-sample.csv
Quote opened email notification.pdf
repomix.config.json
```

# Files

## File: .repomixignore
```
# ====================================================================
# REPOMIX TARGETED DATA BLOCKS (Protects Your Token Budget)
# ====================================================================
# Block the massive database files inflating your context
Customer Job History.csv
prospects-2026-05-23.csv

# Block recursive output files so repomix never bundles itself
repomix-output.md
repo-map.md

# Block all general large spreadsheet files 
# (Except files explicitly named with "-sample.csv" or "-schema.csv")
*.[cC][sS][vV]
*.[xX][lL][sS]*
!*-sample.csv
!*-schema.csv

# ====================================================================
# STANDARD DEVELOPMENT & OS CLEANUP
# ====================================================================
# Windows System Files
Thumbs.db
Desktop.ini
$RECYCLE.BIN/
*.lnk

# OneDrive & Cloud Sync Metadata
.ODS/
*.tmp
~$*

# Node / Package Manager Cache
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml
.npm/

# Environment / Secret Keys
.env
.env.*
*.pem
*.key
*.secret

# IDEs and Editors
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.swp

# Log Files & Terminal Dumps
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

## File: Customer Job History-sample.csv
```
Id,Customer Name,Company Name,Salutation,First Name,Last Name,Street Number,Street Name,Address 2,City,Province,Postal Code,Home Phone,Work Phone,Mobile Phone,Fax,Alt. Phone,Alt. Contact,Email,Notes,Marketing Method,Date Added,Star Rating,Customer Type,Height,Roof Type,Service Required,Additional Services,Send Preference: Email,Send Preference: Text,Tags,Job Date,Job Type,Job Details,Quantity,Each,Price,Assigned To,Duration,Job location,Travel Time(in hrs),Job Time (in hrs),Invoice Number,Estimate Information,Status,Estimate Location
3485,Aaron, ,,Aaron,,24,Sunset Parade,,Chain Valley Bay,NSW,,-,-,-,-,-,,,,,05/30/16,n/a,, , , , ,X,X,,,,,,,,,,,,,,,,
3922,Accom, ,,Accom,,76,Kalakau,,Forresters beach,,,-,-,-414 628 707,-,-,,invoices@accomholidays.com,Clean all glass in and out,,11/15/16,n/a,, , , , ,X,X,,11/22/16,Window Cleaning,,1,280,280,"Ruben Quero, Isaac Terrell",,"76 Kalakau, Forresters beach",,,3511,,,
3922,Accom, ,,Accom,,76,Kalakau,,Forresters beach,,,-,-,-414 628 707,-,-,,invoices@accomholidays.com,Clean all glass in and out,,11/15/16,n/a,, , , , ,X,X,,12/7/2016,Window Cleaning,13 Tudibaring Parade McMasters Beach,1,180,180,Ruben Quero,,"76 Kalakau, Forresters beach",,,4100,,,
3922,Accom, ,,Accom,,76,Kalakau,,Forresters beach,,,-,-,-414 628 707,-,-,,invoices@accomholidays.com,Clean all glass in and out,,11/15/16,n/a,, , , , ,X,X,,12/16/16,Window Cleaning,Inside & Out - 42 Warren Avenue Avoca,1,320,320,Ruben Quero,,"76 Kalakau, Forresters beach",,,4155,,,
3922,Accom, ,,Accom,,76,Kalakau,,Forresters beach,,,-,-,-414 628 707,-,-,,invoices@accomholidays.com,Clean all glass in and out,,11/15/16,n/a,, , , , ,X,X,,12/22/16,Window Cleaning,9/18-20 Scenic Highway Terrigal. Top and Bottom Balconies inside and out.,1,220,220,Ruben Quero,,"76 Kalakau, Forresters beach",,,4166,,,
3922,Accom, ,,Accom,,76,Kalakau,,Forresters beach,,,-,-,-414 628 707,-,-,,invoices@accomholidays.com,Clean all glass in and out,,11/15/16,n/a,, , , , ,X,X,,12/22/16,Window Cleaning,13 Miller Street Terrigal. Top and Bottom Balconies & Windows,1,150,150,Ruben Quero,,"76 Kalakau, Forresters beach",,,4166,,,
4068,Accom, ,,Accom ,,60,tramway north Avoca,,North Avoca ,,,,,,,,,bridgetsheary@accomholidays.com,,,1/9/2017,n/a,, , , , ,X,X,,1/10/2017,Window Cleaning,,1,120,120,Ruben Quero,,"60 tramway north Avoca , North Avoca ",,,4743,,,
4701,Amanda, ,,Amanda,,14,Eyers Close,,Kariong,NSW,2250,-,-,04165-15879,-,-,,,"CCGC client

$150 inc gst

last cleaned September 2016",,1/7/2018,n/a,, , , , ,X,X,,,,,,,,,,,,,,,,
3484,Amber, ,,Amber,,24,McKenzie Ave,,Woy Woy,NSW,,-,-,-,-,-,,,,,05/30/16,n/a,, , , , ,X,X,,,,,,,,,,,,,,,,
4703,Amy, ,,Amy,,11,Segura Street,,Copacabana,NSW,2251,-,-,04015-29515,-,-,,amyprentis13@gmail.com,"CCGC client

$150 inc gst

last cleaned March 2017",,1/7/2018,n/a,, , , , ,X,X,,,,,,,,,,,,,,,,
```

## File: prospects-sample.csv
```
Id,Prospect Name,Company Name,Salutation,First Name,Last Name,Street Address,Address 2,City,Province,Postal Code,Home Phone,Work Phone,Mobile Phone,Fax,Email,Marketing Method,Date Added,Tags,Estimate Information,Status,Estimate Location
1365,Albert,,,Albert,,11 Courtney Place,,Lisarow,NSW,2250,,,04134-02804,,,,10/13/19,,10/14/19 Gutter Cleaning 220.00,Open,"11 Courtney Place, Lisarow, NSW 2250"
2607,Allan,,,Allan,,15 The Breakwater,,Corlette,NSW,2315,,,0428-280328,,,,08/24/21,,08/27/21 Gutter Guard - Powder Coated Aluminium 0.00,Open,"15 The Breakwater, Corlette, NSW 2315"
2607,Allan,,,Allan,,15 The Breakwater,,Corlette,NSW,2315,,,0428-280328,,,,08/24/21,,08/27/21 Gutter Guard - Powder Coated Aluminium 0.00,Open,"15 The Breakwater, Corlette, NSW 2315"
836,Andrew,,,Andrew,,37 Headlam Parade,,Springfield,NSW,2250,042-415-6814,,,,agwcon@gmail.com ,,08/14/18,,08/16/18 Gutter Cleaning 190.00,Pending Sent & Viewed,"37 Headlam Parade, Springfield, NSW 2250"
836,Andrew,,,Andrew,,37 Headlam Parade,,Springfield,NSW,2250,042-415-6814,,,,agwcon@gmail.com ,,08/14/18,,08/16/18 Gutter Guard - Powder Coated Aluminium 1290.00,Pending Sent & Viewed,"37 Headlam Parade, Springfield, NSW 2250"
477,Andrew,,,Andrew,,20 Malison Street,,Wyoming,NSW,2250,02432-82645,,,,,,01/29/18,,01/30/18 Window Cleaning 0.00,Open,"20 Malison Street, Wyoming, NSW 2250"
219,Angela,,,Angela,,1929 Freemans Drive,,Freemans Waterhole,NSW,2323,,,0410547260,,,,06/21/17,,,,
2552,Anurag,,,Anurag,,70 Windsor Road,,Wamberal,NSW,2260,,,0449-184298,,anuragbansal@hotmail.com.au,,07/21/21,,08/02/21 Gutter Cleaning 350.00,Pending Sent & Viewed,"70 Windsor Road, Wamberal, NSW 2260"
2102,Bbbbb,,,Bbbbb,,35 Mary Street Gorokan,,Central coast,Nsw,2263,,,0402-210726,,chloecassidy57@gmail.com,,01/31/21,,,,
943,Brett,,,Brett,,23 Christopher Avenue,,Valentine,NSW,2280,,,0416-278718,,brettandfiona@live.com.au,,10/23/18,,10/25/18 Gutter Guard - Powder Coated Aluminium 2100.00,Pending Sent Only,"23 Christopher Avenue, Valentine, NSW 2280"
```

## File: repomix.config.json
```json
{
  "$schema": "https://repomix.com/schemas/latest/schema.json",
  "input": {
    "maxFileSize": 52428800
  },
  "output": {
    "filePath": "repomix-output.md",
    "style": "markdown",
    "parsableStyle": false,
    "fileSummary": true,
    "directoryStructure": true,
    "files": true,
    "removeComments": true,
    "removeEmptyLines": true,
    "compress": true,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "truncateBase64": false,
    "copyToClipboard": false,
    "includeFullDirectoryStructure": false,
    "tokenCountTree": false,
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100,
      "includeDiffs": false,
      "includeLogs": false,
      "includeLogsCount": 50
    }
  },
  "include": [],
  "ignore": {
    "useGitignore": true,
    "useDotIgnore": true,
    "useDefaultPatterns": true,
    "customPatterns": []
  },
  "security": {
    "enableSecurityCheck": true
  },
  "tokenCount": {
    "encoding": "o200k_base"
  }
}
```

## File: .gitignore
```
.env
```

## File: AGENTS.md
```markdown
# AGENTS.md

## Project Context
This repository captures the requirements and delivery plan for the GRD Guttering / Katwill Services ServiceM8 automation work.

The primary source files are:
- `Email Conversation with Kylie.txt`
- `Accepted quote email notification.pdf`
- `Quote opened email notification.pdf`
- `Customer Job History-sample.csv`
- `prospects-sample.csv`

## Working Rules
1. Treat the conversation and attachments as the source of truth for scope and behavior.
2. Use `Customer Job History-sample.csv` and `prospects-sample.csv` as the working schema/sample references for the CSV exports unless the raw CSVs are explicitly required.
3. Do not assume The Customer Factor has an API. The conversation indicates it is CSV/export driven, with outbound webhooks only for future push-style workflows.
4. Keep historical job data safe and reviewable before writing to ServiceM8. Bulk imports should support a dry-run or review step.
5. Prefer attachments/PDFs for historical records when possible, because the timeline should stay clean unless the user explicitly wants notes instead.
6. Quote-open tracking is not a native ServiceM8 feature. Any implementation should use an approved workaround such as a redirect/tracking layer, or a separate quoting tool if that is the final chosen path.
7. Preserve auditability. Every import or automation should leave a clear log of what was matched, created, skipped, or flagged.
8. Handle duplicate rows defensively. Both CSVs contain repeated IDs and repeated customer/prospect records.

## AGENT EXECUTION RULES (TOKEN EFFICIENCY)
- **Reasoning Budget**: Limit your internal thinking/reasoning steps to a maximum of 3 steps per tool invocation. Do not recursively evaluate your own thoughts.
- **Direct Execution**: When an n8n MCP tool is available and matches the user's intent, call it immediately. Do not write a paragraph explaining why you are calling the tool.
- **No Self-Reflective Loops**: Do not perform "sanity checks" on already completed tool outputs unless a structural error or JSON invalidation is explicitly returned by the server.
- **Concise Planning**: Outline your execution logic in exactly one sentence before formatting your tool block.
- **Tool Prompting**: Prefer terse pre-tool checks that match the JSON schema precisely and avoid n8n 500 errors.
- **Repository Layout**: Use `repomix-output.md` as the primary structural map for this repository; do not assume file paths when writing code and reference that layout directly.

## Delivery Expectations
- Keep `project-specs.md` aligned with the actual requirements and assumptions.
- Keep `plan.md` current as the work is refined or implemented.
- When making implementation decisions, prioritize determinism, traceability, and low manual effort.

## Verification Checklist
- Confirm customer-matching logic before any write action.
- Confirm how historical job history will be stored in ServiceM8: notes, attachments, or both.
- Confirm whether quote notifications will be delivered through ServiceM8, a redirect tracker, or another quoting system.
- Validate a small sample set before any full import.
```

## File: Email Conversation with Kylie.txt
```
Katwill Services
Attachments
4:32 AM (14 hours ago)
to me, Katwill

Hi Ed,

Couple of questions to see if we can do below;

Chargeable to Me 
Can you see if we can utilise an API to get the Job Locations from “The Customer Factor CRM and add them to Sites on a Customer in SM8” - Looks like Job Location is on the History so this could be a way to. Get the information as well
Add Job History Notes - (Attached File to relevant SM8 Customer) - All Customers have been uploaded as of this morning
Add Prospects as Notes - (Attached File to relevant SM8 Customer) - All Customers have been uploaded as of this morning

Quotation for Customisation for Customer - On My Server
When a quote is opened by the customer they get an email (Like Attached)
When a quote is accepted by the customer they get an email (Like Attached)

Thank you,

Kylie Bradfield 
image3.jpeg
📆 Book a Meeting

📞 0405 135 460

᯽ www.katwillservices.com.au

✉️ info@katwillservices.com.au

📍 Maitland NSW Australia

 4 Attachments
  •  Scanned by Gmail

Edmundo Cadorniga
6:07 AM (12 hours ago)
Hi Kylie, These are just based on my research: For 1: The Customer Factor does not have an API at all. What they do have is a push-only system using outbound we

Katwill Services
6:14 AM (12 hours ago)
to me

Thanks Ed,

Please see below in red

Thank you,
Kylie Bradfield 
image3.jpeg
📆 Book a Meeting

📞 0405 135 460

᯽ www.katwillservices.com.au

✉️ info@katwillservices.com.au

📍 Maitland NSW Australia

From: Edmundo Cadorniga <edmundocadorniga@gmail.com>
Date: Saturday, 30 May 2026 at 8:07 am
To: Katwill Services <info@katwillservices.com.au>
Subject: Re: GRD Guttering New Account - SM8 Set Up Questions and Quote

Hi Kylie, 

These are just based on my research:
For 1:
The Customer Factor does not have an API at all. What they do have is a push-only system using outbound webhooks and CSV exports.
Because we cannot actively "pull" data out of their system, we cannot use an API to fetch past job history. However, we can still solve this by doing it in two simple steps:
For Past History: We will use the Job History CSV from The Customer Factor and upload it into n8n to automatically create the Sites in ServiceM8. - Lets do this but is there a way to review that they are going onto the correct customers before we say yes do it
For Future Jobs: We will set up a Webhook in The Customer Factor. Every time a new job is saved, it will instantly push that location data to n8n and add it to ServiceM8 automatically.  (Or use 1 again for the delta after we've added the first batch).  Not going to be needed as SM8 is replacing Customer Factor
For 2 and 3:
Option 1: Adding Data as Notes (Activity Feed) Prefer Option 2
"We can process your CSV files through n8n and add the Job History and Prospect details directly into the customer’s Activity Feed as Notes [1].
How it works: n8n will read your CSV rows, find the matching customer in ServiceM8, and post the text directly onto their timeline [1].
The Benefit: The information is instantly visible right on the main customer screen. Your staff can read the historical notes immediately without clicking into any sub-folders.
The Downside: If the history notes are very long, it can clutter the timeline and make daily operational updates harder to see."
Option 2: Adding Data as Attachments (Files) Would prefer this option as a PDF
"Alternatively, we can use n8n to convert your CSV data into actual Document Files (like text files or PDFs) and attach them to the customer record [1].
How it works: n8n will take the text from each CSV row, package it into an individual file (e.g., Historical_Notes.txt), and upload it straight to the ServiceM8 /Attachment API endpoint [1].
The Benefit: It keeps the main customer timeline completely clean and uncluttered. It serves as a permanent, unalterable archive of your old data [1].
The Downside: Staff will need to click into the 'Attachments' tab on the customer record to open and view the historical information."
Question regarding the Quotes, were those generated from 'The Customer Factor'?  If they switch to ServiceM8, will they be using ServiceM8 quotes or another app such as Pandadoc? We can also create custom quotes for them if that is needed.  They will be using SM8 Proposals and Quotes, more proposals then the PDF quote but will need to work on both


For direct answer to getting alerts:  If they are to use Pandadoc, yes, we can automate notifications.  ServiceM8 does not offer tracking of quotes but I found a workaround. The details of the workaround are below: 
============================
No, ServiceM8 does not natively track or send a notification when a client opens or views a quote.
While ServiceM8 provides automated tracking for when a quote is sent or accepted, it lacks an underlying event or webhook trigger for when the online portal link is simply clicked or opened. [1, 2, 3]
However, you can still easily achieve this exact feature for your client by using a quick workaround inside your n8n setup.
The n8n Workaround: Redirect Link Tracking
Instead of sending the raw ServiceM8 quote link directly to the customer, you use n8n as a hidden tracking bridge:
The Custom Link: When a quote is generated, you have n8n generate a custom tracking URL (e.g., https://your-n8n-server.com) and place it into the ServiceM8 email template instead of the standard {document} tag. [1]
The Open Trigger: The exact millisecond the customer clicks that link, it triggers your n8n workflow first. n8n immediately notes down that the quote was opened and triggers your automated "Quote Opened" notification email.
The Instant Pass-Through: In less than a second, n8n instantly redirects the customer's browser straight to their actual, secure ServiceM8 online quote portal so they can view and sign it seamlessly. [1]
============================
I have not tried that workaround before - that would be good for any customer that doesn't want to use Pandadoc anymore. 

Regards,

Ed Cadorniga
Business Automations and Integrations
edmundocadorniga@gmail.com
```

## File: plan.md
```markdown
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
```

## File: project-specs.md
```markdown
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
```
