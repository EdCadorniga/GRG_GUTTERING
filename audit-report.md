# GRD n8n Workflow Audit Report
**Instance:** https://automation.katwillservices.com.au
**Generated:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**Method:** n8n REST API (X-N8N-API-KEY) — direct inspection of workflow JSON + execution history

---

## === ACTIVE WORKFLOWS ===

### 1. GRD_Match_CSV_to_SM8 (7kEUmyDsb8TFYizO)
- **Active:** yes ✅
- **Version match:** ✅ (versionId=767adf58)
- **Executions:** 0 — manual+webhook trigger, never invoked or executions purged
- **Nodes:** 13
- **Issues:** ✅ None found
  - IF node "Has Match?" correctly uses `String($json._matched)` comparison — no boolean trap
  - All 4 Google Sheets nodes have valid credentials (SnkZZEvybquPKY8P)
  - All 3 DataTable nodes have valid UUIDs

---

### 2. GRD_QuoteEvent_Receiver (xsIKmyZb5t5TsZhG)
- **Active:** yes ✅
- **Version match:** ✅ (versionId=526b267c)
- **Executions:** 23 total, 23 success, 0 failed — last: success @ 2026-07-07 06:15
- **Nodes:** 10
- **Issues:** ⚠️ **1 issue found**
  - **Node "Email Quote Sent" is DISABLED.** The Switch node "Route by Event Type" routes outputs 0 (`job.quote_sent`) and 1 (`proposal.sent`) to this disabled node. Those two event types will silently hit a dead end — no email is sent for quote_sent or proposal_sent events.
    - **If intentional** (only tracking opened/accepted): Remove the dead branches or route them to a NoOp.
    - **If not intentional**: Re-enable "Email Quote Sent" or create a replacement.
  - ✅ All other credentials valid (OAuth2 x3 for SM8 API, Outlook x3)

---

### 3. GRD_ServiceM8_Duplicate_and_Placeholder_Notes_Cleanup (QFFLC3wOzQOynhas)
- **Active:** yes ✅
- **Version match:** ✅ (versionId=4a58cfe4)
- **Executions:** 100 success, 0 failed (capped at 100 in API — likely many more historically) — last: success @ 2026-07-07 20:20
- **Nodes:** 4
- **Issues:** ✅ None found
  - Schedule trigger "Runs every 10 minutes" confirmed working
  - Pagination implemented on SM8 note fetch
  - 2s batch interval on DELETE for rate limiting

---

### 4. GRD_HistoricalJobHistory_Ingest (8mLRB5VpBKisvsUU)
- **Active:** yes ✅
- **Version match:** ✅ (versionId=a08f0632)
- **Executions:** 0 — webhook trigger, never invoked or purged
- **Nodes:** 4
- **Issues:** ⚠️ **1 issue found**
  - **DataTable node "GRD Insert Job History Staging" uses string `"stg_job_history"` as dataTableId** instead of an object `{ value: "wFGBDqBfhBF7aTfr" }`. Other workflows consistently use the UUID object format. This may still work if n8n resolves table names, but it is inconsistent and could break if the table name changes.

---

### 5. GRD_CF_Contacts_Ingest (tJhlMwIiaPRYtDp5)
- **Active:** yes ✅
- **Version match:** ✅ (versionId=4ca9aed6)
- **Executions:** 0 — webhook trigger, never invoked or purged
- **Nodes:** 4
- **Issues:** ✅ None found
  - Clean linear flow: Webhook → Parse CSV → Normalize → Upsert DataTable
  - DataTable node uses correct UUID Ki0oGme1ckXRGZtP

---

### 6. GRD_Prospects_Ingest (QAOmPf3a4dpBeQ61)
- **Active:** yes ✅
- **Version match:** ✅ (versionId=6cd99981)
- **Executions:** 0 — webhook trigger, never invoked or purged
- **Nodes:** 4
- **Issues:** ⚠️ **1 issue found**
  - **DataTable node "GRD Insert Prospect Staging" uses string `"stg_prospects"` as dataTableId** instead of `{ value: "054q2ardHjYv1yE5" }`. Same pattern as HistoricalJobHistory — legacy naming. Consider aligning with UUID format.

---

### 7. GRD_Note_Generate_Batch (KJA8xCVC1ajwBDit)
- **Active:** yes ✅
- **Version match:** ✅ (versionId=43d70d81)
- **Executions:** 0 — webhook trigger, no recent runs
- **Nodes:** 9
- **Issues:** ✅ None found
  - Branching structure correct: Pick Batch → Query JH (idx 0) + Query PR (idx 1) + Merge All (idx 2), with Query JH/PR feeding back into Merge All
  - Postgres + Google Sheets credentials all valid

---

## === INACTIVE WORKFLOWS ===

### 8. GRD_Note_Upload_Batch (ipD5QpBO7ffBHPEK)
- **Active:** no ✅ (matches expected)
- **Version match:** ⚠️ (inactive, saved versionId=5429ab7c)
- **Executions:** 0
- **Nodes:** 11
- **Issues:** ✅ None found
  - Dual triggers: Manual + Every 5 Minutes schedule (both inactive)
  - All credentials valid (Google Sheets + OAuth2 for SM8 + DataTable)

---

### 9. GRD_CustomerSites_Generate (IMj5uhFkElJWDcv5)
- **Active:** no ✅ (matches expected)
- **Version match:** ⚠️ (inactive, saved versionId=738575c9)
- **Executions:** 0
- **Nodes:** 6
- **Issues:** ✅ None found
  - Clean merge flow: Start → Read CF Contacts + Read SM8 UUIDs → Merge → Join & Format → Append to Sheet
  - All credentials valid

---

### 10. GRD_CF_Match_to_UUID (BNcVsucXZc9c0oyk)
- **Active:** no ✅ (matches expected)
- **Version match:** ⚠️ (inactive, saved versionId=f2bcea77)
- **Executions:** 0
- **Nodes:** 6
- **Issues:** ✅ None found
  - Clean merge flow: Start → Read SM8 UUIDs + Read CF Contacts → Merge → Match → Upsert
  - DataTable UUIDs all correct

---

### 11. GRD_Cleanup_Single_Site_Customers (seTKGjvK4YJMJIwi)
- **Active:** no ✅ (matches expected)
- **Version match:** ⚠️ (inactive, saved versionId=3e3b5bc6)
- **Executions:** 0
- **Nodes:** 12
- **Issues:** ✅ None found
  - All credentials valid (Google Sheets x3, OAuth2 for SM8 x3)
  - Dual trigger: Manual + Every 10 min schedule
  - Branching logic correct: Read → Mark → Update → Delete → Collect UUIDs → Fetch Sites → Delete → Mark → Update

---

### 12. GRD_Set_Approval_Validation (QkNVzlIMWM5nUbEq)
- **Active:** no ✅ (matches expected)
- **Version match:** ⚠️ (inactive, saved versionId=730b753b)
- **Executions:** 0
- **Nodes:** 2
- **Issues:** ✅ None found
  - Simple flow: Start → HTTP POST to Google Sheets API (batchUpdate)

---

### 13. GRD_RJS_Sites_Append (GiewPlHvt8gd1Uoe)
- **Active:** no ✅ (matches expected)
- **Version match:** ⚠️ (inactive, saved versionId=c1009be8)
- **Executions:** 0
- **Nodes:** 3
- **Issues:** ⚠️ **2 issues found**
  - **Code node "Generate RJS Rows" is 642,717 characters** — this is almost certainly an inline data dump (JSON/CSV embedded directly in the code). This is an anti-pattern; data should be loaded from a file, Google Sheet, or database.
  - **Google Sheets credential on "Append to Sheet" is EMPTY** — `id=""` and `name=""`. This node will fail with a credential error if activated. Needs a valid `googleSheetsOAuth2Api` credential assigned.

---

### 14. GRD_QuoteOpenBridge_v1 (LEcdO6TYQ2B1X9ia)
- **Active:** no ✅ (matches expected — deactivated, replaced by GRD_QuoteEvent_Receiver)
- **Version match:** ⚠️ (inactive, saved versionId=adba14a1)
- **Executions:** 0
- **Nodes:** 5
- **Issues:** ✅ None found
  - All credentials valid (OAuth2 for SM8 + Outlook)
  - Branching correct: Webhook → Log & Construct Redirect → Redirect Response (idx 0) + Fetch SM8 Job (idx 1) → Email Quote Viewed Alert

---

### 15. GRD_Site_Import (3xsqBGKnV8o4F07p)
- **Active:** no ✅ (matches expected — deactivated, replaced by Cleanup workflow)
- **Version match:** ⚠️ (inactive, saved versionId=c4225890)
- **Executions:** 0
- **Nodes:** 16
- **Issues:** ✅ None found
  - All credentials valid (Google Sheets x2, OAuth2 for SM8 x3, DataTable x2)
  - Complex branching with error handling (Switch node for SM8 result)
  - Dual trigger: Manual + Every 10 Minutes

---

### 16. GRD_QuoteNotifications (BmDCz1WSB5XMrtl6)
- **Active:** no ✅ (matches expected — inactive/replaced by GRD_QuoteEvent_Receiver)
- **Version match:** ⚠️ (inactive, saved versionId=75965edb)
- **Executions:** 0
- **Nodes:** 13
- **Issues:** ⚠️ **1 issue found**
  - **Two IF nodes have null conditions:**
    - "GRD Is Open Event" — `conditions: null`, `parameters: null`
    - "GRD Is Accepted Event" — `conditions: null`, `parameters: null`
  - These IF nodes have no comparison logic configured. If this workflow were activated, both branches would behave unpredictably (likely evaluating as false and falling through to the fallback branch).
  - This workflow appears to be an earlier, incomplete version of the quote event handling (superseded by GRD_QuoteEvent_Receiver).

---

## === CROSS-CUTTING FINDINGS ===

### Credentials Summary
| Credential | ID | Used By |
|---|---|---|
| Google Sheets account | SnkZZEvybquPKY8P | 7 workflows (valid in all except RJS_Sites_Append) |
| GRD GUTTERING APP (OAuth2) | 9xTqnOrjPITTQoxc | 6 workflows (all valid) |
| Postgres account | G7OkQFeCA5TcNofu | 2 workflows (valid) |
| Microsoft Outlook account | aiN4Stkm7IuEu1xv | 2 workflows (valid) |

### DataTable ID Consistency
| Table Name | UUID | Used As |
|---|---|---|
| stg_job_history | wFGBDqBfhBF7aTfr | UUID in Match, string in HistoricalJobHistory ⚠️ |
| stg_prospects | 054q2ardHjYv1yE5 | UUID in Match, string in Prospects_Ingest ⚠️ |
| stg_cf_contacts | Ki0oGme1ckXRGZtP | UUID (consistent) |
| grd_sm8_client_uuids | zSTAdsGxNzi1a4or | UUID (consistent) |
| grd_note_upload_log | 8tEfzXuwTSE793Xk | UUID (consistent) |

### Execution History
- Only 2 workflows have execution history: **QuoteEvent_Receiver** (23 runs) and **Cleanup** (100+ runs)
- All other active workflows are trigger-based (webhooks) with zero recorded executions — they await external invocation
- 0 failed executions across all workflows

### Node Health
- ✅ No DUAL CODE issues found (no code nodes with conflicting nested jsCode)
- ✅ No IF node boolean comparison traps (all use `String()` wrapper or expression-based Switch)
- ✅ All HTTP Request nodes have valid OAuth2 credentials or auth headers
- ✅ All active workflows have matching versionId and activeVersionId

---

## === PRIORITY RECOMMENDATIONS ===

| Priority | Workflow | Issue | Action |
|---|---|---|---|
| **HIGH** | GRD_QuoteEvent_Receiver | Email Quote Sent disabled — quote_sent/proposal_sent events silently dropped | Re-enable or remove dead branches |
| **HIGH** | GRD_RJS_Sites_Append | Empty Google Sheets credential | Assign credential before activating |
| **MEDIUM** | GRD_RJS_Sites_Append | 642KB inline code node | Extract embedded data to external source |
| **MEDIUM** | GRD_HistoricalJobHistory_Ingest | String dataTableId vs UUID | Normalize to UUID format |
| **MEDIUM** | GRD_Prospects_Ingest | String dataTableId vs UUID | Normalize to UUID format |
| **LOW** | GRD_QuoteNotifications | Null IF conditions | Incomplete/superseded — consider archiving |
