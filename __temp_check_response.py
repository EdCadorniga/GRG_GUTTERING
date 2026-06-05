import json
with open(r"C:\Users\edmon\.local\share\opencode\tool-output\tool_e8c588176001Y5r0MBcHRIDAzH") as f:
    data = json.load(f)
d2 = data.get("data", data)
rd = d2.get("resultData", {}).get("runData", {})
for nn, nd in rd.items():
    if "Read Company" in nn:
        for t in nd:
            main = t.get("data", {}).get("main", [[]])
            for batch in main:
                if batch:
                    first = batch[0].get("json", {})
                    last = batch[-1].get("json", {})
                    print("First item uuid:", first.get("uuid", "N/A"))
                    print("Last item uuid:", last.get("uuid", "N/A"))
                    print("First item keys:", list(first.keys())[:10])
                    # Check if response has nextCursor or cursor in body
                    for k in first:
                        if "cursor" in k.lower() or "next" in k.lower():
                            print(f"  Found cursor field: {k}={first[k]}")
                    # Check if the response body itself has cursor info
                    print("All response keys (top level):")
                    for k in batch[0].keys():
                        if k != "json":
                            print(f"  {k}: {str(batch[0][k])[:100]}")
                    break
