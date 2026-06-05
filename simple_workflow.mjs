import { workflow, node, trigger } from "@n8n/workflow-sdk";

const start = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Start' }
});

export default workflow("GRD_SM8_Bulk_Upsert", "Bulk insert 2455 SM8 companies into grd_sm8_client_uuids")
  .add(start);