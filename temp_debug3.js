const jsonStr = '{"requests":[{"setDataValidation":{"range":{"sheetId":2101739941,"startColumnIndex":5,"endColumnIndex":6,"startRowIndex":1},"rule":{"condition":{"type":"ONE_OF_LIST","values":[{"userEnteredValue":"Approved"},{"userEnteredValue":"Needs Review"},{"userEnteredValue":"Rejected"},{"userEnteredValue":"Pending"}]},"inputMessage":"Select approval status","strict":true,"showCustomUi":true}}}]}';
console.log('Length:', jsonStr.length);
try {
    const result = JSON.parse(jsonStr);
    console.log('JSON.parse SUCCESS');
    console.log(JSON.stringify(result, null, 2));
} catch(e) {
    console.log('JSON.parse FAILED:', e.message);
    console.log('String:', jsonStr);
}
