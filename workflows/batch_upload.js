const https = require('https');
const fs = require('fs');

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkOWJhNDc2NC0yYjI2LTRjOGMtODYyZi0zNjBiZWU3NWRlMjMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNmYzZjcxZWUtN2M4OS00YzU5LWE2OWUtNDQxZGVhOThlMmI1IiwiaWF0IjoxNzc4MzQ0MzQ2fQ.wfTeCKzuBd5cWKFUF5tVJTUsI27SfafUGE1fo14v7NY';

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  const rawHeader = parseLine(lines[0]);
  const header = rawHeader.map(h => h.replace(/\r$/, '').trim());
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseLine(lines[i]);
    const row = {};
    header.forEach((h, idx) => { row[h] = vals[idx] !== undefined ? vals[idx] : null; });
    data.push(row);
  }
  return { header, data };
}

function parseLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}

// Map CSV column names to Data Table column names
const JH_MAP = {
  'Id': 'Id',
  'Customer Name': 'Customer_Name',
  'Company Name': 'Company_Name',
  'Salutation': 'Salutation',
  'First Name': 'First_Name',
  'Last Name': 'Last_Name',
  'Street Number': 'Street_Number',
  'Street Name': 'Street_Name',
  'Address 2': 'Address_2',
  'City': 'City',
  'Province': 'Province',
  'Postal Code': 'Postal_Code',
  'Home Phone': 'Home_Phone',
  'Work Phone': 'Work_Phone',
  'Mobile Phone': 'Mobile_Phone',
  'Fax': 'Fax',
  'Alt. Phone': 'Alt_Phone',
  'Alt. Contact': 'Alt_Contact',
  'Email': 'Email',
  'Notes': 'Notes',
  'Marketing Method': 'Marketing_Method',
  'Date Added': 'Date_Added',
  'Star Rating': 'Star_Rating',
  'Customer Type': 'Customer_Type',
  'Height': 'Height',
  'Roof Type': 'Roof_Type',
  'Service Required': 'Service_Required',
  'Additional Services': 'Additional_Services',
  'Send Preference: Email': 'Send_Preference_Email',
  'Send Preference: Text': 'Send_Preference_Text',
  'Tags': 'Tags',
  'Job Date': 'Job_Date',
  'Job Type': 'Job_Type',
  'Job Details': 'Job_Details',
  'Quantity': 'Quantity',
  'Each': 'Each',
  'Price': 'Price',
  'Assigned To': 'Assigned_To',
  'Duration': 'Duration',
  'Job location': 'Job_location',
  'Travel Time(in hrs)': 'Travel_Time_in_hrs',
  'Job Time (in hrs)': 'Job_Time_in_hrs',
  'Invoice Number': 'Invoice_Number',
  'Estimate Information': 'Estimate_Information',
  'Status': 'Status',
  'Estimate Location': 'Estimate_Location'
};

const PROSPECTS_MAP = {
  'Id': 'Id',
  'Prospect Name': 'Prospect_Name',
  'Company Name': 'Company_Name',
  'Salutation': 'Salutation',
  'First Name': 'First_Name',
  'Last Name': 'Last_Name',
  'Street Address': 'Street_Address',
  'Address 2': 'Address_2',
  'City': 'City',
  'Province': 'Province',
  'Postal Code': 'Postal_Code',
  'Home Phone': 'Home_Phone',
  'Work Phone': 'Work_Phone',
  'Mobile Phone': 'Mobile_Phone',
  'Fax': 'Fax',
  'Email': 'Email',
  'Marketing Method': 'Marketing_Method',
  'Date Added': 'Date_Added',
  'Tags': 'Tags',
  'Estimate Information': 'Estimate_Information',
  'Status': 'Status',
  'Estimate Location': 'Estimate_Location'
};

const JH_SCHEMA = {
  Id: 'number',
  Customer_Name: 'string', Company_Name: 'string', Salutation: 'string',
  First_Name: 'string', Last_Name: 'string', Street_Number: 'string', Street_Name: 'string',
  Address_2: 'string', City: 'string', Province: 'string', Postal_Code: 'string',
  Home_Phone: 'string', Work_Phone: 'string', Mobile_Phone: 'string', Fax: 'string',
  Alt_Phone: 'string', Alt_Contact: 'string', Email: 'string', Notes: 'string',
  Marketing_Method: 'string', Date_Added: 'string', Star_Rating: 'string', Customer_Type: 'string',
  Height: 'string', Roof_Type: 'string', Service_Required: 'string', Additional_Services: 'string',
  Send_Preference_Email: 'string', Send_Preference_Text: 'string', Tags: 'string',
  Job_Date: 'string', Job_Type: 'string', Job_Details: 'string',
  Quantity: 'number', Each: 'number', Price: 'number',
  Assigned_To: 'string', Duration: 'string', Job_location: 'string',
  Travel_Time_in_hrs: 'string', Job_Time_in_hrs: 'string', Invoice_Number: 'string',
  Estimate_Information: 'string', Status: 'string', Estimate_Location: 'string'
};

const PROSPECTS_SCHEMA = {
  Id: 'number',
  Prospect_Name: 'string', Company_Name: 'string', Salutation: 'string',
  First_Name: 'string', Last_Name: 'string', Street_Address: 'string', Address_2: 'string',
  City: 'string', Province: 'string', Postal_Code: 'string', Home_Phone: 'string',
  Work_Phone: 'string', Mobile_Phone: 'string', Fax: 'string', Email: 'string',
  Marketing_Method: 'string', Date_Added: 'string', Tags: 'string',
  Estimate_Information: 'string', Status: 'string', Estimate_Location: 'string'
};

function typedRow(row, schema) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    if (v === '' || v === null || v === undefined) {
      out[k] = null;
    } else if (schema[k] === 'number') {
      out[k] = parseFloat(v.replace(/[^0-9.-]/g, '')) || null;
    } else {
      out[k] = v;
    }
  }
  return out;
}

function insertBatch(tableId, rows) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ data: rows });
    const req = https.request({
      method: 'POST',
      hostname: 'automation.katwillservices.com.au',
      path: '/api/v1/data-tables/' + tableId + '/rows',
      headers: { 'X-N8N-API-KEY': apiKey, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      rejectUnauthorized: false
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(d));
        else reject(new Error('HTTP ' + res.statusCode + ': ' + d.substring(0, 300)));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function uploadCSV(tableId, filePath, colMap, schema, label) {
  console.log('Reading', filePath, '...');
  const raw = fs.readFileSync(filePath, 'utf8');
  const { header, data } = parseCSV(raw);
  console.log('CSV columns:', header.join(', '));
  
  // Remap column names
  const mappedRows = data.map(row => {
    const out = {};
    for (const [csvCol, val] of Object.entries(row)) {
      const dbCol = colMap[csvCol];
      if (dbCol) out[dbCol] = val;
    }
    // Add Id separately (handled in schema)
    return typedRow(out, schema);
  });

  console.log('Parsed', mappedRows.length, 'rows from', label);
  console.log('Sample row:', JSON.stringify(mappedRows[0]));

  const batchSize = 1000;
  let inserted = 0;
  for (let i = 0; i < mappedRows.length; i += batchSize) {
    const batch = mappedRows.slice(i, i + batchSize);
    try {
      const result = await insertBatch(tableId, batch);
      inserted += (result.insertedRows || batch.length);
    } catch (e) {
      console.error('\nError at batch', i, ':', e.message);
      // Retry once with smaller batch
      try {
        const batch2 = mappedRows.slice(i, i + 250);
        const result = await insertBatch(tableId, batch2);
        inserted += (result.insertedRows || batch2.length);
      } catch (e2) {
        console.error('Retry also failed at', i, ':', e2.message);
        console.log('Sample row:', JSON.stringify(batch[0]));
        throw e2;
      }
    }
    const pct = Math.round((i + batch.length) / mappedRows.length * 100);
    process.stdout.write('\r' + label + ': ' + inserted + '/' + mappedRows.length + ' (' + pct + '%)    ');
  }
  console.log('\n' + label + ': Done -', inserted, 'rows inserted');
  return inserted;
}

const basePath = 'C:\\Users\\edmon\\OneDrive\\Documents\\Projects\\GRD Guttering';

(async () => {
  try {
    await uploadCSV(
      '054q2ardHjYv1yE5',
      basePath + '\\prospects-2026-05-23.csv',
      PROSPECTS_MAP,
      PROSPECTS_SCHEMA,
      'Prospects'
    );

    await uploadCSV(
      'wFGBDqBfhBF7aTfr',
      basePath + '\\Customer Job History.csv',
      JH_MAP,
      JH_SCHEMA,
      'JobHistory'
    );

    console.log('\nAll uploads complete!');
  } catch (e) {
    console.error('\nUpload failed:', e.message);
  }
})();
