# Quote Email Notifications — What We're Building

## In a Nutshell

Right now, when you send a quote to a customer, you don't know if they've:
- Read it
- Opened it more than once
- Accepted it (until they call you)

We're fixing that. You'll get an email alert every time something happens.

---

## The Three Alerts

### 1. Quote Sent

**When it fires:** The moment you click "Send" on a quote or proposal inside ServiceM8.

**The email you'll receive:**

> **AUTOMATION — {{Customer Name}} has been sent Quote #{{Quote Number}}**
>
> Hi GRD Guttering,
>
> Quick email to let you know that {{Customer Name}} has been sent Quote #{{Quote Number}}.
>
> **Quote dated:** {{Quote Date}}
> **Work to be performed:**
> {{Work Description}}
>
> **Service Location:** {{Service Location}}
>
> **Email address:** {{Customer Email}}
> **Cell Phone:** {{Customer Phone}}
>
> **[Open in ServiceM8]**

Every field shown above — customer name, quote number, work description, location, contact details — is pulled in real time from the actual ServiceM8 job.

**How often:** Once per quote — no duplicates.

---

### 2. Quote Opened

**When it fires:** The moment a customer clicks the link in their quote email (or views their quote online through ServiceM8).

This fires every time they open it, so you'll know if they come back for a second look later.

**The email you'll receive:**

> **AUTOMATION — {{Customer Name}} has viewed Quote #{{Quote Number}}**
>
> Hi GRD Guttering,
>
> {{Customer Name}} has viewed Quote #{{Quote Number}}.
>
> **Work to be performed:**
> {{Work Description}}
>
> **Service Location:** {{Service Location}}
>
> **Email address:** {{Customer Email}}
> **Cell Phone:** {{Customer Phone}}
>
> **[Open in ServiceM8]**

**How often:** Every time the link is clicked. If they open it Monday, again Wednesday, and again Friday — you get three alerts.

---

### 3. Quote Accepted

**When it fires:** The moment a customer accepts a quote in ServiceM8 (status changes to "Work Order").

**The email you'll receive:**

> **AUTOMATION — Great News! {{Customer Name}} has accepted Quote #{{Quote Number}} and wants to schedule.**
>
> Hi GRD Guttering,
>
> Great News! {{Customer Name}} has accepted Quote #{{Quote Number}} and wants to schedule.
>
> **Work to be performed:**
> {{Work Description}}
>
> **Total for accepted items:** ${{Total Amount}}
>
> **Service Location:** {{Service Location}}
>
> **Email address:** {{Customer Email}}
> **Cell Phone:** {{Customer Phone}}
>
> **[Open in ServiceM8]**

**How often:** Once per accepted quote — no duplicates.

---

## How It Works (Plain English)

We connect your ServiceM8 account to our automation system. When ServiceM8 registers an event (sending a quote, a customer viewing a quote, accepting a quote), our system instantly looks up the full job details and sends the email to you.

When a customer clicks the quote link in their email, it first touches our server (which logs the event), then immediately forwards them to the real ServiceM8 quote page. They see no delay, no extra steps, no difference at all.

---

## What You Need to Do

**One 30-second change in ServiceM8:**

1. Go to **Account > Settings > Email Templates**
2. Open each template that sends a quote or proposal link
3. Find the link that currently goes to `{document}` or a standard SM8 quote URL
4. Replace it with the tracking URL we provide

That's it. You do it once, and it applies to every quote from that point on.

### Testing first

Before we turn it on for real, we'll run a test with our own email address. You send a test quote to us, we click the link, and we confirm all three alerts arrive correctly. Once the test passes, we switch the alerts over to your email address.

**Nothing else changes.** You still:
- Create and send quotes the same way
- Use the same SM8 email system
- Have the same customer experience
- Get the same automated quote PDF generation

---

## What We Need From You

| Item | Answer |
|------|--------|
| **Email address** for alerts | Where should alerts go in production? (e.g. info@grdguttercleaning.com.au, or a specific person). During testing we'll use our own address to confirm everything works, then switch to yours. |
| **Repeat alerts** for quote opens | Do you want an alert every time the customer opens it, or only the first time? |

---

## What It Looks Like After Setup

Your day doesn't change. You send quotes as usual. But now:

- **9:00 AM** — You send Quote #1234 to Acme Roofing
- **9:01 AM** — You get an email: "Acme Roofing has been sent Quote #1234"
- **3:00 PM** — Acme opens the quote link. You get: "Acme Roofing has viewed Quote #1234"
- **3:30 PM** — They open it again (maybe to show their partner). You get another alert
- **5:00 PM** — Acme accepts. You get: "Acme Roofing has accepted Quote #1234 and wants to schedule"

You know exactly what's happened at every step, without checking SM8 or waiting for the phone to ring.

---

## Safeguards

- Nothing is deleted from ServiceM8 — we only add notifications
- Duplicate checks prevent double alerts for the same event
- The tracking link always redirects to the real SM8 quote page — it never breaks or slows down
- You can pause or change the setup at any time
- Every event is logged for your records
