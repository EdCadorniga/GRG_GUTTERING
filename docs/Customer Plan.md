# GRD Guttering / Katwill Services — Automation Plan

## Phase 1 — Data Migration *(completed)*

- Reviewed your spreadsheets and cleaned up the data
- Fixed phone numbers to Australian format
- Fixed addresses (spelling, missing fields)
- Built a review spreadsheet where you approve each row before anything is created
- Created PDFs of each customer's job history
- Migrated approved customers, contacts, and PDFs into your ServiceM8 account
- Set up company profiles for 2,000+ customers with job history PDFs attached

---

## Phase 2 — Quote Notifications

You get instant email alerts for three events. Each uses the best approach for its job.

### Quote Sent

ServiceM8 fires a `job.quote_sent` or `proposal.sent` event the moment you send a quote or proposal through SM8. We subscribe to these events and send you an alert in real time.

- **No changes to your workflow** — send quotes exactly as you do today
- **Email**: customer name, quote number, work description, service location, contact details, link to open in SM8
- **One alert per quote sent** — no duplicates

### Quote Opened / Viewed

Customers open quotes in two ways. We cover both.

**A. Customer clicks the link in the SM8 email** *(most common)*
We replace the standard quote link in your SM8 email template with a tracking link. When clicked:
- We log the IP address, device type, and exact time
- We send your alert immediately
- The customer is redirected to the real SM8 quote page in under a second — they see no difference

**B. Customer views through SM8's online system** *(backup)*
ServiceM8 fires a `proposal.viewed` event whenever a proposal is accessed online. We subscribe to this as a redundancy layer — it catches views that might not go through the bridge (e.g. if the link is shared internally, or if SM8 opens the quote on behalf of the customer).

- **Why both?** The bridge gives you richer data (IP, user agent, geographic location) and works independently of SM8's event system. The webhook is a fallback that ensures nothing is missed.
- **Email**: customer name, quote number, work description, service location, contact details, link to open in SM8, and the time they opened it
- **Alerts on every view** — you'll know when they come back for a second look

### Quote Accepted

ServiceM8 fires a `job.quote_accepted` event when a customer accepts a quote. We subscribe and send you an alert.

- **No changes to your workflow** — accept quotes exactly as you do today
- **Email**: customer name, quote number, **total amount**, work description, service location, contact details, and a prompt to schedule the work
- **One alert per acceptance** — no duplicates

---

## Summary — What changes in your SM8

| Area | Changes needed |
|------|---------------|
| Email templates | One-time link update (swap `{document}` for the tracking URL in each template that sends quotes) |
| Your daily workflow | None |
| Customer experience | None — they see the normal SM8 quote page |
| Notifications | You get email alerts for sent, opened, and accepted |

The one template change is a 30-second edit, and you only do it once. Every template that sends a quote or proposal link needs the same tiny swap.

---

## What you need to tell us

1. Which email address should receive the alerts?
2. Do you want alerts on every quote open, or only the first time each customer views it?

---

## Safeguards

- Nothing is deleted from your existing ServiceM8 account — we only add new records
- Duplicate checks run before anything is created — no double alerts
- The customer is always redirected to the real SM8 quote page — no delays, no broken links
- Every action is logged
- You can pause or change anything at any time
