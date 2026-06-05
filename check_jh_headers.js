const fs = require('fs');
const csv = fs.readFileSync('C:\\Users\\edmon\\OneDrive\\Documents\\Projects\\GRD Guttering\\Customer Job History.csv', 'utf8');
const firstLine = csv.split('\n')[0];
console.log('JH CSV header:');
const cols = firstLine.split(',').map(c => c.replace(/^"|"$/g,''));
cols.forEach((c,i) => console.log('  [' + i + '] "' + c + '"'));
