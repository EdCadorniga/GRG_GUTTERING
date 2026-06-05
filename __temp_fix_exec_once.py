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

ALLOWED_NODE_KEYS = {"id", "name", "type", "typeVersion", "position", "parameters", "credentials", "notes", "disabled", "executeOnce"}

# Update Read Company Notes
for n in wf.get("nodes", []):
    if n["name"] == "Read Company Notes":
        n["executeOnce"] = True
        break

def clean_node(n):
    return {k: v for k, v in n.items() if k in ALLOWED_NODE_KEYS}

payload = {
    "name": wf["name"],
    "nodes": [clean_node(n) for n in wf["nodes"]],
    "connections": wf["connections"],
    "settings": wf.get("settings", {}),
}
if wf.get("tags"):
    payload["tags"] = wf["tags"]

r2 = requests.put(f"{base_url}/api/v1/workflows/QFFLC3wOzQOynhas", headers=hdr, json=payload)
print(f"PUT status: {r2.status_code}")
if r2.status_code == 200:
    print("OK: executeOnce restored")
else:
    print(f"FAIL: {r2.text[:1000]}")
