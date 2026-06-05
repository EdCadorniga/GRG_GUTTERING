import json

with open(r"C:\Users\edmon\.local\share\opencode\tool-output\tool_e8c56c21900136wjT0J0j5tkts") as f:
    data = json.load(f)

d2 = data.get("data", data)
rd = d2.get("resultData", {}).get("runData", {})

for nn, nd in rd.items():
    for t in nd:
        main = t.get("data", {}).get("main", [])
        total = sum(len(b) for b in main if b)
        status = t.get("executionStatus", "?")
        print(f"{nn}: {len(main)} batches, {total} items, status={status}")
