const fs = require('fs');
const csv = fs.readFileSync('C:\\Users\\edmon\\OneDrive\\Documents\\Projects\\GRD Guttering\\Customer Job History.csv', 'utf8').split(/\r?\n/);
const header = csv[0].split(',').map(h => h.replace(/^"|"$/g,''));
const idIdx = header.indexOf('Id');
console.log('Id column index:', idIdx);
let total = 0, withId = 0, uniqueIds = new Set();
for (let i = 1; i < csv.length; i++) {
  if (!csv[i].trim()) continue;
  total++;
  const cols = csv[i].split(',');
  const id = (cols[idIdx] || '').replace(/^"|"$/g,'').trim();
  if (id && id !== '.') { withId++; uniqueIds.add(id); }
}
console.log('Total data rows:', total);
console.log('Rows with non-empty Id:', withId);
console.log('Unique Id values:', uniqueIds.size);
