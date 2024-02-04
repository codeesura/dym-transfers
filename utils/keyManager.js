const fs = require('fs');

function getPrivateKeys(filePath) {
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
}

module.exports = { getPrivateKeys };
