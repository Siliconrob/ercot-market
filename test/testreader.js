const reader = require('./readhtml');

//console.log(reader.urlOptions);

const axios = require('axios');
const streamZip = require('node-stream-zip');
const fs = require('fs').promises;
const tempWrite = require('temp-write');

async function zippedData(link) {
  const response = await axios.get(link);
  console.log(response);
  return response.data;
}

(async function() {
  const results = await reader.extractSCEDUrls();

  const dl = results.shift();
  console.log(dl);
  const response = await axios({
    url: dl,
    method: 'GET',
    responseType: 'arraybuffer',
  });

  const filePath = await tempWrite(Buffer.from(response.data));
  await fs.writeFile('abc.zip', await fs.readFile(filePath));
})();
