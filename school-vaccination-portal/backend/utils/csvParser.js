const csv = require('csv-parser');
const fs = require('fs');

function parseCSV(filePath) {
return new Promise((resolve, reject) => {
const results = [];
fs.createReadStream(filePath)
.pipe(csv())
.on('data', (data) => results.push(data))
.on('end', () => resolve(results))
.on('error', reject);
});
}

module.exports = parseCSV;