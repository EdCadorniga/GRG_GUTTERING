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

## Repomix Reference Rule
Review the attached `repomix-output.md` file. It contains the complete project plans, correspondence logs, and the explicit structural schemas (including column headers and the first 10 sample data rows) for both `Customer Job History-sample.csv` and `prospects-sample.csv`. Learn the exact data formatting patterns, data types, and column layouts from these samples. When asked to build database scripts or automate webhook routing for GRD Guttering, ensure your output structures strictly mirror these verified file schemas.
