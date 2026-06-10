import { workflow, node, trigger, expr } from '@n8n/workflow-sdk';

const webhook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Quote Open Webhook',
    parameters: {
      httpMethod: 'GET',
      path: 'quote-open-bridge',
      responseMode: 'responseNode',
      options: {}
    }
  }
});

const logEvent = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Log & Construct Redirect',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const query = $input.first().json.query || {};
const params = $input.first().json.params || {};
const dest = query.dest || params.dest || '';
const jobId = query.job_id || params.job_id || '';
const customerName = query.name || params.name || '';
const timestamp = new Date().toISOString();
const headers = $input.first().json.headers || {};
const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown';
const userAgent = headers['user-agent'] || 'unknown';
const redirectUrl = dest || ('https://katwill.servicem8.com/quote_open/' + encodeURIComponent(jobId));
let jobUuid = '';
try {
  const urlObj = new URL(dest);
  const pathParts = urlObj.pathname.split('/').filter(Boolean);
  jobUuid = pathParts[pathParts.length - 1] || '';
} catch (e) {}
const eventLog = { jobId, customerName, timestamp, ip, userAgent, redirectUrl, jobUuid };
console.log('Quote Opened:', JSON.stringify(eventLog));
return [{ json: { redirectUrl, jobId, customerName, timestamp, jobUuid } }];`
    }
  }
});

const fetchJob = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Fetch SM8 Job',
    parameters: {
      method: 'GET',
      url: expr("{{ 'https://api.servicem8.com/api_1.0/job.json?$filter=generated_job_id%20eq%20%27' + $json.jobId + '%27' }}"),
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'httpHeaderAuth',
      options: {
        response: {
          response: {
            responseFormat: 'json'
          }
        }
      }
    },
    credentials: {
      httpHeaderAuth: { id: 'GPcEchQEV01z2dDz', name: 'Katwill SM8 API Key' }
    }
  }
});

const emailAlert = node({
  type: 'n8n-nodes-base.microsoftOutlook',
  version: 2,
  config: {
    name: 'Email Quote Viewed Alert',
    parameters: {
      resource: 'message',
      operation: 'send',
      toRecipients: 'info@grdguttercleaning.com.au',
      subject: expr('{{ $json.company_name + " has viewed Quote #" + $json.generated_job_id }}'),
      bodyContent: expr(`{{ "<b>AUTOMATION</b><br><br><b>Quote or Proposal has been Opened</b><br><br>Hi GRD Gutter Cleaning,<br><br>" + $json.company_name + " has viewed Quote #" + $json.generated_job_id + ".<br><br><b>Work to be performed:</b><br>" + ($json.description || 'N/A') + "<br><br><b>Service Location:</b> " + ($json.job_address || 'N/A') + "<br><br><b>Email address:</b> " + ($json.email || 'N/A') + "<br><b>Cell Phone:</b> " + ($json.mobile || 'N/A') + "<br><br><a href=\\"https://katwill.servicem8.com/job_open/" + $json.job_uuid + "\\">Open in ServiceM8</a>" }}`),
      additionalFields: { bodyContentType: 'html' }
    },
    credentials: {
      microsoftOutlookOAuth2Api: { id: 'aiN4Stkm7IuEu1xv', name: 'Microsoft Outlook account' }
    }
  }
});

const respondToWebhook = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Redirect Response',
    parameters: {
      respondWith: 'redirect',
      redirectURL: expr('{{ $json.redirectUrl }}'),
      options: { responseCode: 302 }
    }
  }
});

export default workflow('GRD_QuoteOpenBridge_v1', 'GRD_Quote Open Bridge v1')
  .add(webhook)
  .to(logEvent)
  .branchTo([respondToWebhook, fetchJob])
  .to(emailAlert);
