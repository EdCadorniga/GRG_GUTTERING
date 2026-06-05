import json, requests, os

env_path = r"C:\Users\edmon\OneDrive\Documents\Projects\GRD Guttering\.env"
api_key = None
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if line.startswith("N8N_KATWILL_API_KEY"):
            api_key = line.split("=", 1)[1].strip().strip("'\"")
base_url = "https://automation.katwillservices.com.au"
hdr = {"X-N8N-API-KEY": api_key, "Content-Type": "application/json"}

r = requests.get(f"{base_url}/api/v1/workflows/QFFLC3wOzQOynhas", headers=hdr)
wf = r.json()

ALLOWED = {"id","name","type","typeVersion","position","parameters","credentials","notes","disabled","executeOnce"}

# Add $filter back to query (alongside cursor)
for n in wf.get("nodes", []):
    if n["name"] == "Read Company Notes":
        qp = n.setdefault("parameters", {}).setdefault("queryParameters", {})
        qp["parameters"] = [
            {"name": "cursor", "value": "-1"},
        ]
        # Also set batching to minimal (don't batch output items)
        opts = n.setdefault("parameters", {}).setdefault("options", {})
        # Remove batching entirely - let pagination work natively
        if "batching" in opts:
            del opts["batching"]
        print("Removed batching, kept pagination")
        break

def clean_node(n):
    return {k: v for k, v in n.items() if k in ALLOWED}

payload = {
    "name": wf["name"],
    "nodes": [clean_node(n) for n in wf["nodes"]],
    "connections": wf["connections"],
    "settings": wf.get("settings", {}),
}
if wf.get("tags"):
    payload["tags"] = wf["tags"]

r2 = requests.put(f"{base_url}/api/v1/workflows/QFFLC3wOzQOynhas", headers=hdr, json=payload)
print(f"PUT: {r2.status_code}")
if r2.status_code == 200:
    print("OK")
else:
    print(r2.text[:500])
