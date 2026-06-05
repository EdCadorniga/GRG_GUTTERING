const jsonStr = '{"requests":[{"setDataValidation":{"range":{"sheetId":2101739941,"startColumnIndex":5,"endColumnIndex":6,"startRowIndex":1},"rule":{"condition":{"type":"ONE_OF_LIST","values":[{"userEnteredValue":"Approved"},{"userEnteredValue":"Needs Review"},{"userEnteredValue":"Rejected"},{"userEnteredValue":"Pending"}]},"inputMessage":"Select approval status","strict":true,"showCustomUi":true}}}}]}';
console.log('Length:', jsonStr.length);
console.log('Char at 385:', JSON.stringify(jsonStr[385]), 'code:', jsonStr.charCodeAt(385));
console.log('Context [380-400]:', JSON.stringify(jsonStr.substring(380,400)));
try {
    const result = JSON.parse(jsonStr);
    console.log('JSON.parse SUCCESS');
} catch(e) {
    console.log('JSON.parse FAILED:', e.message);
}
