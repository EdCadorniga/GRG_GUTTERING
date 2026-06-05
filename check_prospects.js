const https = require('https');
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkOWJhNDc2NC0yYjI2LTRjOGMtODYyZi0zNjBiZWU3NWRlMjMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNmYzZjcxZWUtN2M4OS00YzU5LWE2OWUtNDQxZGVhOThlMmI1IiwiaWF0IjoxNzc4MzQ0MzQ2fQ.wfTeCKzuBd5cWKFUF5tVJTUsI27SfafUGE1fo14v7NY';

let total = 0, withData = 0, cursor = null;

function fetchPage() {
  return new Promise((resolve, reject) => {
    let path = '/api/v1/data-tables/Ncw03CMuHVt9o7fE/rows?limit=250';
    if (cursor) path += '&cursor=' + encodeURIComponent(cursor);
    https.get({ hostname: 'automation.katwillservices.com.au', path, headers: { 'X-N8N-API-KEY': apiKey }, rejectUnauthorized: false }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const o = JSON.parse(d);
          if (!o.data) {
            console.error('Unexpected response:', d.substring(0, 200));
            resolve(false);
            return;
          }
          total += o.data.length;
          withData += o.data.filter(r => r.Prospect_Name).length;
          cursor = o.nextCursor;
          resolve(!!cursor);
        } catch(e) {
          console.error('Parse error:', e.message, 'Data:', d.substring(0, 200));
          resolve(false);
        }
      });
    }).on('error', e => reject(e));
  });
}

(async () => {
  let hasMore = true;
  while (hasMore) hasMore = await fetchPage();
  console.log('Total rows:', total);
  console.log('Rows with Prospect_Name:', withData);
})();
