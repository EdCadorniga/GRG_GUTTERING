import json, requests, os

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

r = requests.get(f"{BASE_URL}/api/v1/workflows/{WF_ID}", headers=HEADERS)
wf = r.json()
print(f"Fetched: {wf.get('name')}")

for n in wf["nodes"]:
    if n["name"] == "Read Company Notes":
        # Match working reference pattern exactly
        n["parameters"]["options"] = {
            "pagination": {
                "pagination": {
                    "paginationMode": "updateAParameterInEachRequest",
                    "parameters": {
                        "parameters": [{
                            "type": "qs",
                            "name": "cursor",
                            "value": "={{ $response.json[$response.json.length - 1].uuid }}"
                        }]
                    },
                    "limitPagesFetched": False,
                    "requestInterval": 500
                }
            }
        }
        # Remove executeOnce — may conflict with pagination
        n.pop("executeOnce", None)
        print("Updated node: removed executeOnce, simplified pagination")
        break

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
    print(f"FAIL: {r2.status_code} — {r2.text[:500]}")
