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
AGENTS.md
data/exports/export_Customer_Notes.tsv
data/exports/export_Job_History_Review.tsv
data/exports/export_Matching_Exceptions.tsv
data/samples/Customer Job History-sample.csv
data/samples/prospects-sample.csv
docs/assets/Accepted quote email notification.pdf
docs/assets/Quote opened email notification.pdf
docs/assets/screenshot of where Customer Sites should appear.png
docs/Customer Plan.md
docs/Email Conversation with Kylie.txt
docs/project-specs.md
repomix.config.json
workflows/batch_note_gen.js
workflows/batch_upload.js
workflows/GRD_Customer_Sites.js
workflows/GRD_CustomerSites_Create.js
workflows/GRD_CustomerSites_Generate.js
workflows/GRD_Fetch_SM8_Contacts.js
workflows/GRD_Match_CSV_to_SM8.js
workflows/GRD_Note_Generate.js
workflows/GRD_Note_Upload_Batch.js
workflows/GRD_Note_Upload.js
workflows/GRD_QuoteOpenBridge_v1.js
workflows/GRD_RJS_Sites_Append.js
workflows/GRD_ServiceM8_Note_Cleanup.js
workflows/GRD_Site_Import.js
```

# Files

## File: data/exports/export_Customer_Notes.tsv
````
Customer_Name ServiceM8_UUID Source_Table Note_Content Approval_Status Review_Notes	Customer_Name	ServiceM8_UUID	Source_Table	Note_Content	Approval_Status	Review_Notes	_matched	_matchType
	Aaron	8e8bf7c2-f264-44d2-90b0-243f9f8a443b	Job History		Pending		TRUE	name
````

## File: data/exports/export_Job_History_Review.tsv
````
Id	Customer_Name	Company_Name	Salutation	First_Name	Last_Name	Street_Number	Street_Name	Address_2	City	Province	Postal_Code	Home_Phone	Work_Phone	Mobile_Phone	Fax	Alt_Phone	Alt_Contact	Email	Notes	Marketing_Method	Date_Added	Star_Rating	Customer_Type	Height	Roof_Type	Service_Required	Additional_Services	Send_Preference_Email	Send_Preference_Text	Tags	Job_Date	Job_Type	Job_Details	Quantity	Each	Price	Assigned_To	Duration	Job_location	Travel_Time_in_hrs	Job_Time_in_hrs	Invoice_Number	Estimate_Information	Status	Estimate_Location	id	createdAt	updatedAt	Approval_Status	Review_Notes
																																														1	2026-06-01T04:08:42.413Z	2026-06-01T04:08:42.413Z		
																																														2	2026-06-01T04:08:42.413Z	2026-06-01T04:08:42.413Z		
3485	Aaron			Aaron		24	Sunset Parade		Chain Valley Bay	NSW											5/30/16	n/a						X	X					0	0	0										3	2026-06-01T05:29:29.830Z	2026-06-01T05:29:29.830Z		
3922	Accom			Accom		76	Kalakau		Forresters beach					414 628 707				invoices@accomholidays.com	Clean all glass in and out		11/15/16	n/a						X	X		11/22/16	Window Cleaning		1	280	280	Ruben Quero, Isaac Terrell		76 Kalakau, Forresters beach			3511				4	2026-06-01T05:29:29.830Z	2026-06-01T05:29:29.830Z		
																																														5	2026-06-01T05:38:56.819Z	2026-06-01T05:38:56.819Z		
																																														6	2026-06-01T05:38:56.819Z	2026-06-01T05:38:56.819Z		
																																														7	2026-06-01T05:38:56.819Z	2026-06-01T05:38:56.819Z		
																																														8	2026-06-01T05:38:56.819Z	2026-06-01T05:38:56.819Z		
																																														9	2026-06-01T05:38:56.819Z	2026-06-01T05:38:56.819Z		
																																														10	2026-06-01T05:38:56.819Z	2026-06-01T05:38:56.819Z
````

## File: data/exports/export_Matching_Exceptions.tsv
````
Source_Table	Record_Id	Customer_Name	Match_Field	Match_Value	Issue_Description	Resolved	Resolution_Notes	_matched
Job History		Test API Format2	Customer_Name	Test API Format2	No matching company found in ServiceM8 (exact match only)	No		FALSE
````

## File: data/samples/Customer Job History-sample.csv
````
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
````

## File: data/samples/prospects-sample.csv
````
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
````

## File: docs/Customer Plan.md
````markdown
# GRD Guttering — ServiceM8 Automation Plan

## What we've already done

- Reviewed your two spreadsheets: **Customer Job History** (24,870 rows of completed work) and **Prospects** (5,272 rows of old estimates)
- Set up the automation server on your VPS
- Built the review spreadsheet in Google Sheets with these tabs:
    - **Job History Review** — all your completed jobs
    - **Prospects Review** — all your old estimates
    - **Matching Exceptions** — any rows that need special attention
    - **Write Log** — a log of every action we take
    - **Customer PDFs** — a clickable list of all PDFs we create, with links to preview them
- Cleaned up your phone numbers into standard Australian format (e.g. `0414 628 707`, `02 4325 2577`)
- Cleaned up your addresses — fixed spelling of state names, moved misplaced city and postcode values into the right columns, filled in gaps where the same customer had a missing city or postcode in one row but had it in another
- Uploaded your full spreadsheets to your server so the system can read them directly
- Connected the Google Sheet to your server so data flows from the spreadsheet files into the review workbook automatically
- Confirmed ServiceM8's requirements for creating customers, contacts, and attaching files
- Confirmed that your ServiceM8 account has the **Client Sites** addon enabled for customers with multiple job locations

---

## Phase 1 — Data Migration

### Stage 1 — You review the data

- We populate the review spreadsheet with all your cleaned-up data
- Each row includes a `PDF_Content` column showing exactly what text will go into that customer's PDF
- You can edit this column — add notes, remove details, fix anything before we proceed
- Next to each row is an **Approval Status** column. You mark each row as:
    - **Approved** — go ahead and put this into ServiceM8
    - **Rejected** — skip this one
    - **Fix Needed** — something is wrong, let us know
- Rows that look like spam or test entries are automatically marked as Rejected
- Nothing gets written to ServiceM8 before you approve it

### Stage 2 — Create customer profiles

- For every approved row, we create a customer profile in ServiceM8
- If a customer with the same name already exists, we skip the duplicate and link to the existing one instead
- For customers who have had work done at multiple addresses, each different address gets its own site under their profile
- We save every customer's ServiceM8 ID into a lookup table so we know exactly where to attach their PDF later

### Stage 3 — Create contact details

- For every approved customer, we add their contact information:
    - First name and last name
    - Phone numbers (already cleaned up to Australian format)
    - Email address
- Each contact is linked to the correct customer profile

### Stage 4 — Generate PDFs

- We create one PDF per customer (not one per row)
    - If "Accom" had 6 jobs, all 6 appear listed together in a single PDF
    - If you only approved 4 of those 6 jobs, only those 4 appear
- If a customer had jobs at different addresses, the PDF groups the work by address
- PDFs are named simply:
    - `Customer_Job_History_Accom.pdf` for completed jobs
    - `prospect_Andrew.pdf` for old estimates
- Each PDF is stored on your server and listed in the **Customer PDFs** tab of the spreadsheet
- You can click any link in that tab to open and preview the PDF before it goes into ServiceM8

### Stage 5 — Upload PDFs to ServiceM8

- We attach each PDF to the correct customer's profile in ServiceM8
- The PDF appears in their **Attachments** tab — staff can open it with one click
- Your job list stays clean — the history is stored as attachments, not mixed in with daily activity

### Stage 6 — Sample check before full run

- We run the entire process on a small batch of 10 customers first
- You spot-check a few customer profiles in ServiceM8 to confirm:
    - Names and addresses are correct
    - Contact details are right
    - PDFs look good and open properly
- **You give the go-ahead** before we run the full 30,000-row import

### What your ServiceM8 looks like after Phase 1

- Every approved customer has a profile with their name, address, and contact info
- Customers with multiple job locations have separate sites under their profile
- Each customer's profile has a PDF attachment with their complete job history or estimate information
- Old estimates appear as customer profiles only — no fake jobs cluttering your job list
- Your existing customers and jobs in ServiceM8 are completely untouched

---

## Phase 2 — Quote Notifications

### Quote opened alerts

- ServiceM8 does not tell you when a customer opens a quote — we add this feature
- We make a one-time update to your quote email templates, swapping the normal link for a tracking link
- If you use more than one template, we update every one that has a quote link. You only need to do this once
- From that point on, every time a customer clicks "View Your Quote":
    - The click is recorded instantly on your server
    - You get an email with the customer name, quote number, job type, and the time they opened it
    - The customer is redirected straight to the real ServiceM8 quote page — they see no delay or extra steps
- The customer still gets exactly one email, and it still comes from ServiceM8 as usual
- If they open it again later, you get another notification (up to a limit you choose)

### Quote accepted alerts

- ServiceM8 already knows when a quote is accepted — we set up a notification for you
- You receive an email with the customer name, quote number, total amount, job address, and a note to schedule the work

### What you need to decide

- Which email address should receive the notifications?
- Do you want the "opened" email to include a link so you can follow up right away?
- How many opened alerts per quote before we stop sending them?

---

## What we need from you

1. Review the spreadsheet when we send you the link
2. Mark each row as Approved, Rejected, or Fix Needed
3. Tell us which email address should receive the quote notifications
4. Give the go-ahead after the sample batch check, so we can run the full import

---

## Safeguards

- Nothing is deleted from your existing ServiceM8 account — we only add new records
- Duplicate checks run before anything is created — we never create the same customer twice
- Everything goes through the review spreadsheet first — nothing touches ServiceM8 without your approval
- You can pause at any stage or ask us to re-run a stage
- Every action is logged so you can see exactly what happened and when
````

## File: docs/Email Conversation with Kylie.txt
````
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
````

## File: docs/project-specs.md
````markdown
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
- Include quote identifier, customer identity, accepted work, total
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

## Open Questions (need Kylie feedback)
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
- [ ] Quote-open tracking records views and notifies Kylie
- [ ] Full 24,870 job history + 5,272 prospect rows processed
````

## File: workflows/batch_note_gen.js
````javascript

````

## File: workflows/batch_upload.js
````javascript
function parseCSV(text)
⋮----
function parseLine(line)
⋮----
// Map CSV column names to Data Table column names
⋮----
function typedRow(row, schema)
⋮----
function insertBatch(tableId, rows)
⋮----
async function uploadCSV(tableId, filePath, colMap, schema, label)
````

## File: workflows/GRD_Customer_Sites.js
````javascript

````

## File: workflows/GRD_CustomerSites_Create.js
````javascript

````

## File: workflows/GRD_CustomerSites_Generate.js
````javascript

````

## File: workflows/GRD_Fetch_SM8_Contacts.js
````javascript

````

## File: workflows/GRD_Match_CSV_to_SM8.js
````javascript

````

## File: workflows/GRD_Note_Generate.js
````javascript

````

## File: workflows/GRD_Note_Upload_Batch.js
````javascript

````

## File: workflows/GRD_Note_Upload.js
````javascript

````

## File: workflows/GRD_QuoteOpenBridge_v1.js
````javascript

````

## File: workflows/GRD_RJS_Sites_Append.js
````javascript

````

## File: workflows/GRD_ServiceM8_Note_Cleanup.js
````javascript

````

## File: workflows/GRD_Site_Import.js
````javascript

````

## File: .gitignore
````
.env
````

## File: .repomixignore
````
# ====================================================================
# REPOMIX TARGETED DATA BLOCKS (Protects Your Token Budget)
# ====================================================================
# Block the massive database files inflating your context
data/raw/Customer Job History.csv
data/raw/prospects-2026-05-23.csv
data/raw/customers-2026-06-02.csv

# Block large export files (audit/temp — not needed for context)
data/exports/customer_notes_latest.tsv
data/exports/unmatched_sites_455.json
data/exports/export_Matching_Exceptions.csv
data/exports/export_Customer_Notes.csv

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
````

## File: repomix.config.json
````json
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
````

## File: AGENTS.md
````markdown
# AGENTS.md

## Project Context
This repository captures the requirements and delivery plan for the GRD Guttering / Katwill Services ServiceM8 automation work.

Primary source files (under `docs/`):
- `docs/Email Conversation with Kylie.txt`
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
| GRD_Site_Import | 3xsqBGKnV8o4F07p | Manual + 10min | Approved rows → POST SM8 company.json (50/batch) |
| GRD_QuoteOpenBridge_v1 | LEcdO6TYQ2B1X9ia | Webhook GET | 302 redirect to SM8 quote_open page |
| GRD_QuoteSent_Tracker | sdtvgdpvcdciB77W | 30min poll | Poll SM8 for quote_sent, dedup, Outlook alert |
| GRD_QuoteAccepted_Tracker | u6qdYM5qyiqKcAp5 | 30min poll | Poll SM8 for status=Work Order, Outlook alert |

### Project Status Summary

**Data ingested:** 15K CF contacts, 51K job history rows, 5K prospects, 2.4K SM8 companies
**Match results:** 1,925 exact name matches (17.4%); 1,647 CF→SM8 UUIDs; all 3,997 Customer Sites have UUIDs
**Notes:** 1,712 JH + 180 PR + 202 "No records" = all 1,925 covered. 0 placeholders.
**Site import:** Active, 50/batch, 200ms delay, 10-min schedule. Reads approved rows → parse AU address → POST company.json
**Quote tracking:** Quote-sent and quote-accepted trackers active. QuoteOpenBridge v1 deployed (webhook 302 redirect).

### Next Steps (ordered)
1. **Id-chain fallback matching** for ~2,321 unmatched CF names (CF Id → JH/PR Id → customer_name → UUID lookup)
2. **Fuzzy matching** for remaining unmatched names (Dice coefficient or phone/email)
3. **New SM8 company creation** for unmatched names with no existing company
4. Re-run Note Generate & Upload with improved matching
5. Quote notifications and quote-open bridge improvements (GRD_QuoteNotifications needs unarchiving)

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
│   ├── Email Conversation with Kylie.txt
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
````
