import json

with open(r"C:\Users\edmon\.local\share\opencode\tool-output\tool_e8c54b7d10019tG77S3P0zzhl7") as f:
    data = json.load(f)

d2 = data.get("data", data)
rd = d2.get("resultData", {}).get("runData", {})

for nn, nd in rd.items():
    for t in nd:
        main = t.get("data", {}).get("main", [])
        total = sum(len(b) for b in main if b)
        print(f"{nn}: {len(main)} batches, {total} total items")
        print(f"  executionStatus: {t.get('executionStatus', '?')}")
        if total > 0:
            for b in main[:1]:
                for item in b[:2]:
                    j = item.get("json", {})
                    print(f"  uuid={str(j.get('uuid', '?'))[:20]} reason={j.get('cleanup_reason', '?')}")
