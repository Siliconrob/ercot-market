const reader = require('./readhtml');
const contentDisposition = require('content-disposition');
const axios = require('axios');
const zip = require('unzip-simple');
const fs = require('node-fs-extra');
const tempWrite = require('temp-write');

async function downloadZipFile(link) {
  const response = await axios({
    url: link,
    method: 'GET',
    responseType: 'arraybuffer',
  });

  const headerLine = contentDisposition.parse(response.headers['content-disposition']);
  const fileName = headerLine.parameters.filename;
  const filePath = await tempWrite(Buffer.from(response.data));
  await fs.remove(fileName);
  await fs.writeFile(fileName, await fs.readFile(filePath));
  return fileName;
}

async function extractContents(zippedFile) {
  const files = await zip.unzip({input: zippedFile, filter: '*.csv'});
  console.log(files);
}

(async function() {
  const urls = await reader.extractSCEDUrls();
  const urlPromises = urls.map(async (url) => {
    const zipFile = await downloadZipFile(url);
    await extractContents(zipFile);
  });
  await Promise.all(urlPromises);
})();
