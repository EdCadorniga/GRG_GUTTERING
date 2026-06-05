import json
import urllib.request
import sys

# Read the SM8 companies
with open(r'C:\Users\edmon\OneDrive\Documents\Projects\GRD Guttering\sm8_companies.json', 'r', encoding='utf-8') as f:
    companies = json.load(f)

print(f"Loaded {len(companies)} companies")

# Prepare rows
rows = []
for c in companies:
    rows.append({
        "customer_name": c["name"],
        "sm8_company_uuid": c["uuid"],
        "site_address": c.get("address", ""),
        "ingested_at": "2026-06-01T22:45:03Z",
        "source_table": "sm8_query",
        "email": "",
        "phone": "",
        "sm8_site_uuid": ""
    })

print(f"Prepared {len(rows)} rows")

# Insert in batches of 250
batch_size = 250
total = len(rows)

for i in range(0, total, batch_size):
    batch = rows[i:min(i+batch_size, total)]
    # Print the batch as a JSON that can be used with the MCP tool
    print(f"BATCH {i//batch_size}: {len(batch)} rows")
    json_str = json.dumps(batch, ensure_ascii=False)
    # Save to file
    outfile = rf'C:\Users\edmon\OneDrive\Documents\Projects\GRD Guttering\sm8_mcp_batch_{i//batch_size}.json'
    with open(outfile, 'w', encoding='utf-8') as f:
        f.write(json_str)
    print(f"  Saved to {outfile}")

print("Done")
