import json

with open(r"C:\Users\edmon\.local\share\opencode\tool-output\tool_e8c588176001Y5r0MBcHRIDAzH") as f:
    data = json.load(f)

d2 = data.get("data", data)
rd = d2.get("resultData", {}).get("runData", {})

for nn, nd in rd.items():
    for t in nd:
        main = t.get("data", {}).get("main", [])
        for bi, b in enumerate(main):
            print(f"{nn} batch {bi}: {len(b)} items")
        if nn == "Build Cleanup Candidates":
            for b in main:
                for item in b[:5]:
                    j = item.get("json", {})
                    print(f"  uuid={str(j.get('uuid',''))[:20]} reason={j.get('cleanup_reason','')} company={str(j.get('company_uuid',''))[:20]}")
