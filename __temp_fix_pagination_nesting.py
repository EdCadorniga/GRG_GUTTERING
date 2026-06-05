import json, requests, os, copy

# Load env
env_path = r"C:\Users\edmon\OneDrive\Documents\Projects\GRD Guttering\.env"
api_key = None
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if line.startswith("N8N_KATWILL_API_KEY"):
            api_key = line.split("=", 1)[1].strip().strip("'\"")
            break

BASE_URL = "https://automation.katwillservices.com.au"
HEADERS = {"X-N8N-API-KEY": api_key, "Content-Type": "application/json"}
WF_ID = "QFFLC3wOzQOynhas"

# Fetch current workflow
r = requests.get(f"{BASE_URL}/api/v1/workflows/{WF_ID}", headers=HEADERS)
wf = r.json()
print(f"Fetched workflow: {wf.get('name')}")

# Find the Read Company Notes node
for n in wf["nodes"]:
    if n["name"] == "Read Company Notes":
        print("Found Read Company Notes node")

        # Fix pagination: add double nesting
        n["parameters"]["options"] = {
            "pagination": {
                "pagination": {
                    "paginationMode": "updateAParameterInEachRequest",
                    "parameters": {
                        "parameters": [
                            {
                                "type": "qs",
                                "name": "cursor",
                                "value": "={{ $response.json[$response.json.length - 1].uuid }}"
                            }
                        ]
                    },
                    "paginationCompleteWhen": "other",
                    "completeExpression": "={{ $response.json.length === 0 }}",
                    "limitPagesFetched": True,
                    "maxRequests": 100
                }
            }
        }

        # Also ensure executeOnce is set
        n["executeOnce"] = True
        break

# Ensure the query parameters include $filter
for n in wf["nodes"]:
    if n["name"] == "Read Company Notes":
        qp = n["parameters"].get("queryParameters", {}).get("parameters", [])
        has_filter = any(p.get("name") == "$filter" for p in qp)
        has_cursor = any(p.get("name") == "cursor" for p in qp)
        if not has_filter:
            qp.insert(0, {"name": "$filter", "value": "active eq 1 and related_object eq 'company'"})
        if not has_cursor:
            qp.append({"name": "cursor", "value": "-1"})
        n["parameters"]["queryParameters"]["parameters"] = qp

# Strip readonly fields
READONLY = {"id","versionId","versionCounter","triggerCount","shared",
    "activeVersion","activeVersionId","meta","createdAt","updatedAt",
    "createdBy","updatedBy","owner","project","active","isArchived",
    "webhookId","displayLabel","displayColor","icon","iconData","tags"}

def strip_readonly(obj):
    if isinstance(obj, dict):
        return {k: strip_readonly(v) for k, v in obj.items() if k not in READONLY}
    elif isinstance(obj, list):
        return [strip_readonly(item) for item in obj]
    return obj

payload = strip_readonly({
    "name": wf.get("name"),
    "nodes": wf["nodes"],
    "connections": wf.get("connections", {}),
    "settings": {}
})

r2 = requests.put(f"{BASE_URL}/api/v1/workflows/{WF_ID}", headers=HEADERS, json=payload)
if r2.status_code == 200:
    print(f"PUT: 200 — versionId: {r2.json().get('versionId')}")
else:
    print(f"PUT FAILED: {r2.status_code} — {r2.text[:500]}")
