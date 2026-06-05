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
