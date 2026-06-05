"""
n8n Patcher — Automated node validation and targeted REST API patching.

Usage:
  python n8n_patcher.py --wf-id <ID> --node-json '<JSON>'
  python n8n_patcher.py --wf-id <ID> --node-file <path.json>
  python n8n_patcher.py --create --wf-json '<JSON>' --name "My Workflow"
  python n8n_patcher.py --create --wf-file <path.json> --name "My Workflow"

Enforces:
- No IF nodes (must use Switch)
- HTTP URL and credential guardrails
- Code node jsCode cleanliness (no markdown fences)
- No stray unquoted n8n expressions
"""

import json
import re
import sys
import os
import copy
import requests
from datetime import datetime

# --- Config from .env ---
def load_env():
    env_path = r"C:\Users\edmon\OneDrive\Documents\Projects\GRD Guttering\.env"
    if not os.path.exists(env_path):
        print("ERROR: .env not found in project root")
        sys.exit(1)
    api_key = None
    base_url = "https://automation.katwillservices.com.au"
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line.startswith("N8N_KATWILL_API_KEY"):
                api_key = line.split("=", 1)[1].strip().strip("'\"")
    if not api_key:
        print("ERROR: N8N_KATWILL_API_KEY not found in .env")
        sys.exit(1)
    return base_url, api_key

BASE_URL, API_KEY = load_env()
HEADERS = {
    "X-N8N-API-KEY": API_KEY,
    "Content-Type": "application/json"
}

GRD_SM8_CREDENTIAL = {
    "oAuth2Api": {
        "id": "9xTqnOrjPITTQoxc",
        "name": "GRD GUTTERING APP",
    }
}

BANNED_CRED_MARKERS = (
    "eUA1365Qtg5nsd7l",
    "Wauchope Solar",
    "Wauchope",
)

READONLY_FIELDS = {"id","versionId","versionCounter","triggerCount","shared",
    "activeVersion","activeVersionId","meta","createdAt","updatedAt",
    "createdBy","updatedBy","owner","project","active","isArchived",
    "webhookId","displayLabel","displayColor","icon","iconData","tags"}

def strip_readonly(obj):
    """Recursively strip readonly fields from workflow JSON."""
    if isinstance(obj, dict):
        return {k: strip_readonly(v) for k, v in obj.items()
                if k not in READONLY_FIELDS}
    elif isinstance(obj, list):
        return [strip_readonly(item) for item in obj]
    return obj

def is_servicem8_http_node(node):
    """Return True when a HTTP Request node targets ServiceM8."""
    if "n8n-nodes-base.httprequest" not in str(node.get("type", "")).lower():
        return False
    params = node.get("parameters", {})
    url = str(params.get("url", "")).lower()
    return "servicem8.com" in url

def normalize_service_m8_credentials(node):
    """Force all ServiceM8 HTTP nodes onto the GRD credential."""
    if is_servicem8_http_node(node):
        node["credentials"] = copy.deepcopy(GRD_SM8_CREDENTIAL)
    return node

def normalize_workflow_service_m8_credentials(workflow):
    """Force every ServiceM8 HTTP node in a workflow onto the GRD credential."""
    for node in workflow.get("nodes", []):
        normalize_service_m8_credentials(node)
    return workflow

def verify_workflow_credentials(wf_id):
    """Read back a workflow and ensure no banned credential references remain."""
    workflow = get_workflow(wf_id)
    serialized = json.dumps(workflow)
    lowered = serialized.lower()
    for marker in BANNED_CRED_MARKERS:
        if marker.lower() in lowered:
            print(f"ERROR: workflow {wf_id} still contains banned credential marker: {marker}")
            sys.exit(1)
    for node in workflow.get("nodes", []):
        if is_servicem8_http_node(node):
            creds = node.get("credentials", {})
            if creds.get("oAuth2Api") != GRD_SM8_CREDENTIAL["oAuth2Api"]:
                print(f"ERROR: ServiceM8 node '{node.get('name', 'unknown')}' is not bound to GRD GUTTERING APP")
                sys.exit(1)
    return workflow

def validate_node(node):
    """Validate a single node against patcher guardrails. Returns (valid, msg, fixed_node)."""
    nid = node.get("id", node.get("name", "unknown"))
    ntype = node.get("type", "")
    params = node.get("parameters", {})

    # 1. Ban IF nodes
    if "n8n-nodes-base.if" in ntype.lower():
        return False, f"Node [{nid}] rejected: IF nodes forbidden. Use Switch instead.", node

    # 2. Validate Switch node (supports all three modes)
    if "n8n-nodes-base.switch" in ntype.lower():
        mode = params.get("mode", "rules")
        routing_rules = params.get("routingRules", None)

        if mode == "expression":
            if "numberOutputs" not in params:
                return False, f"Switch [{nid}] expression mode missing 'numberOutputs'.", node
        elif mode == "routing" or (isinstance(routing_rules, list) and len(routing_rules) > 0):
            # Routing mode: v3+ stores rules as flat array OR as {rules: [...]}
            if isinstance(routing_rules, list):
                pass  # Flat array = valid n8n v3+ routing structure
            elif isinstance(routing_rules, dict) and routing_rules.get("rules"):
                pass  # {rules: [...]} wrapper also accepted
            else:
                return False, f"Switch [{nid}] routing mode: invalid routingRules structure.", node
        else:
            # Standard rules mode
            if "rules" not in params or not params["rules"].get("rules"):
                return False, f"Switch [{nid}] missing 'rules.rules'.", node
            for rule in params["rules"]["rules"]:
                if "dataType" not in rule:
                    rule["dataType"] = "string"

    # 3. Sanitize HTTP Request URLs
    if "httprequest" in ntype.lower():
        url = params.get("url", "")
        if url and not url.startswith(("http://", "https://", "=")):
            params["url"] = "https://" + url
        auth_val = json.dumps(params).lower()
        if "authentication" not in params and ("authorization" in auth_val or "x-api-key" in auth_val):
            if not (params.get("sendHeaders") and params.get("headerParameters")):
                return False, f"HTTP [{nid}]: Do not hardcode auth in params.", node
        if "authentication" not in params:
            params["authentication"] = "genericCredentialType"
        normalize_service_m8_credentials(node)

    # 4. Clean Code node jsCode
    if "n8n-nodes-base.code" in ntype.lower():
        jscode = params.get("jsCode", "")
        if "```" in jscode:
            jscode = re.sub(r"```(?:javascript|js)?", "", jscode).strip()
            params["jsCode"] = jscode

    # 5. Check for unquoted n8n expressions (skip HTTP nodes — URLs use {{}} legitimately)
    if "httprequest" not in ntype.lower():
        node_str = json.dumps(node)
        if re.search(r'(?<!")=(\{\{.*?\}\})', node_str):
            return False, f"Node [{nid}]: Found unquoted n8n expression.", node

    node_str = json.dumps(node)
    lowered = node_str.lower()
    for marker in BANNED_CRED_MARKERS:
        if marker.lower() in lowered:
            return False, f"Node [{nid}] contains banned credential marker '{marker}'.", node

    node["parameters"] = params
    return True, "OK", node

def get_workflow(wf_id):
    """Fetch current workflow JSON from n8n."""
    r = requests.get(f"{BASE_URL}/api/v1/workflows/{wf_id}", headers=HEADERS)
    if r.status_code != 200:
        print(f"ERROR: Failed to fetch workflow {wf_id}: {r.status_code} {r.text}")
        sys.exit(1)
    return r.json()

def patch_node(wf_id, target_node):
    """Fetch workflow, update the target node (by ID or name), PUT back."""
    workflow = get_workflow(wf_id)
    normalize_workflow_service_m8_credentials(workflow)
    nodes = workflow.get("nodes", [])
    target_id = target_node.get("id")
    target_name = target_node.get("name")
    updates = {k: v for k, v in target_node.items() if k != "id"}

    found = False
    for i, n in enumerate(nodes):
        if target_id and n.get("id") == target_id:
            nodes[i].update(updates)
            nodes[i]["id"] = n.get("id")
            found = True
            break
        elif target_name and n.get("name") == target_name:
            nodes[i].update(updates)
            nodes[i]["id"] = n.get("id")
            found = True
            break

    if not found:
        print(f"ERROR: Node '{target_id or target_name}' not found in workflow {wf_id}")
        sys.exit(1)

    payload = strip_readonly({
        "name": workflow.get("name", ""),
        "nodes": nodes,
        "connections": workflow.get("connections", {}),
    })
    payload["settings"] = {}
    r = requests.put(f"{BASE_URL}/api/v1/workflows/{wf_id}", headers=HEADERS, json=payload)
    if r.status_code == 200:
        verify_workflow_credentials(wf_id)
        print(f"OK: Node '{target_id or target_name}' patched in workflow {wf_id}")
    else:
        print(f"ERROR: PUT failed ({r.status_code}): {r.text[:500]}")
        sys.exit(1)

def create_workflow(name, nodes, connections):
    """Create a new workflow via REST API."""
    workflow = {"name": name, "nodes": nodes, "connections": connections}
    normalize_workflow_service_m8_credentials(workflow)
    payload = {"name": workflow["name"], "nodes": workflow["nodes"], "connections": workflow["connections"], "settings": {}}
    r = requests.post(f"{BASE_URL}/api/v1/workflows", headers=HEADERS, json=payload)
    if r.status_code in (200, 201):
        data = r.json()
        print(f"OK: Workflow created — ID: {data.get('id')}, Name: {data.get('name')}")
        return data
    else:
        print(f"ERROR: POST failed ({r.status_code}): {r.text[:1000]}")
        sys.exit(1)

def update_full_workflow(wf_id, nodes, connections, name=None):
    """Replace nodes and connections in existing workflow."""
    wf = get_workflow(wf_id) if name is None else None
    workflow = {"name": name or (wf.get("name", "") if wf else ""), "nodes": nodes, "connections": connections}
    normalize_workflow_service_m8_credentials(workflow)
    payload = strip_readonly({
        "name": workflow["name"],
        "nodes": workflow["nodes"],
        "connections": workflow["connections"],
    })
    payload["settings"] = {}
    r = requests.put(f"{BASE_URL}/api/v1/workflows/{wf_id}", headers=HEADERS, json=payload)
    if r.status_code == 200:
        verify_workflow_credentials(wf_id)
        data = r.json()
        print(f"OK: Workflow {wf_id} updated — versionId: {data.get('versionId')}")
        return data
    else:
        print(f"ERROR: PUT failed ({r.status_code}): {r.text[:1000]}")
        sys.exit(1)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--wf-id", help="Workflow ID to patch")
    parser.add_argument("--node-json", help="Node JSON string")
    parser.add_argument("--node-file", help="Node JSON file path")
    parser.add_argument("--create", action="store_true", help="Create new workflow")
    parser.add_argument("--update", help="Update full workflow nodes+connections")
    parser.add_argument("--wf-json", help="Full workflow JSON (for create/update)")
    parser.add_argument("--wf-file", help="Full workflow JSON file (for create/update)")
    parser.add_argument("--name", default=None, help="Workflow name")
    args = parser.parse_args()

    # --- Create or Update full workflow ---
    if args.create or args.update:
        wf_json_str = None
        if args.wf_json:
            wf_json_str = args.wf_json
        elif args.wf_file:
            with open(args.wf_file) as f:
                wf_json_str = f.read()
        if not wf_json_str:
            print("ERROR: --wf-json or --wf-file required for --create/--update")
            sys.exit(1)
        wf_data = json.loads(wf_json_str)
        nodes = wf_data.get("nodes", [])
        connections = wf_data.get("connections", {})

        # Validate every node
        clean_nodes = []
        for n in nodes:
            valid, msg, fixed = validate_node(n)
            if not valid:
                print(f"GUARDRAIL: {msg}")
                sys.exit(1)
            clean_nodes.append(fixed)

        if args.create:
            name = args.name or wf_data.get("name", "Untitled Workflow")
            create_workflow(name, clean_nodes, connections)
        elif args.update:
            update_full_workflow(args.update, clean_nodes, connections)
        sys.exit(0)

    # --- Single-node patch ---
    node_json_str = None
    if args.node_json:
        node_json_str = args.node_json
    elif args.node_file:
        with open(args.node_file) as f:
            node_json_str = f.read()

    if not node_json_str or not args.wf_id:
        print("ERROR: --wf-id and --node-json or --node-file required for patching")
        sys.exit(1)

    node_data = json.loads(node_json_str)
    valid, msg, clean_node = validate_node(node_data)
    if not valid:
        print(f"GUARDRAIL: {msg}")
        sys.exit(1)
    print(f"OK: Node validated")
    patch_node(args.wf_id, clean_node)
