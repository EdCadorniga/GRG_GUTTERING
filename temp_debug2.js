const jsonStr = '{"requests":[{"setDataValidation":{"range":{"sheetId":2101739941,"startColumnIndex":5,"endColumnIndex":6,"startRowIndex":1},"rule":{"condition":{"type":"ONE_OF_LIST","values":[{"userEnteredValue":"Approved"},{"userEnteredValue":"Needs Review"},{"userEnteredValue":"Rejected"},{"userEnteredValue":"Pending"}]},"inputMessage":"Select approval status","strict":true,"showCustomUi":true}}}}]}';
console.log('Length:', jsonStr.length);
// Print brace by brace with context
for (let i = 0; i < jsonStr.length; i++) {
    const c = jsonStr[i];
    if ('{}[]'.includes(c)) {
        console.log(`Position ${i}: ${c} | context: ${jsonStr.substring(Math.max(0,i-10), i+10)}`);
    }
}
console.log('Full string:');
console.log(jsonStr);
