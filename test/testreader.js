const reader = require('./readhtml');
const contentDisposition = require('content-disposition');
const axios = require('axios');
const unzip = require('unzip-simple').default;
const fs = require('fs-extra');
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
  const files = await unzip({input: zippedFile, filter: '*.csv'});
  const extractedFiles = files.map(async (file) => {
    await fs.writeFile(file.name, file.buffer.toString());
    return file.name;
  });
  const newFiles = await Promise.all(extractedFiles);
  return newFiles;
}

(async function() {
  const urls = await reader.extractSCEDUrls();
  const urlPromises = urls.map(async (url) => {
    const files = await extractContents(await downloadZipFile(url));
  });
  await Promise.all(urlPromises);
})();
