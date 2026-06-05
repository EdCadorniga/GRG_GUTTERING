const fs = require('fs');
const csv = fs.readFileSync('C:\\Users\\edmon\\OneDrive\\Documents\\Projects\\GRD Guttering\\prospects-2026-05-23.csv', 'utf8');
const firstLine = csv.split('\n')[0];
console.log('Prospects CSV header:');
const cols = firstLine.split(',').map(c => c.replace(/^"|"$/g,''));
cols.forEach((c,i) => console.log('  [' + i + '] "' + c + '"'));
