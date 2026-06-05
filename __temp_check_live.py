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
for n in wf.get("nodes", []):
    if n["name"] == "Read Company Notes":
        print("node keys:", list(n.keys()))
        print("executeOnce:", n.get("executeOnce"))
        print("params:", json.dumps(n.get("parameters", {}), indent=2)[:2000])
        break
