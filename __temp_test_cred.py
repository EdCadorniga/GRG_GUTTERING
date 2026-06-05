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

# Use an execute endpoint that proxies the SM8 call through n8n's HTTP request tool
# Or use the n8n workflow proxy to call SM8

# Let's try getting an OAuth2 token from n8n's credential test
r1 = requests.post(
    f"{base_url}/api/v1/credentials/9xTqnOrjPITTQoxc/test",
    headers=hdr
)
print(f"Credential test: {r1.status_code}")
if r1.status_code == 200:
    result = r1.json()
    print(json.dumps(result, indent=2)[:1000])
else:
    print(r1.text[:500])
