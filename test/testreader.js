const reader = require('./readhtml');
const contentDisposition = require('content-disposition');
const axios = require('axios');
const unzip = require('unzip-simple').default;
const fs = require('fs-extra');
const tempWrite = require('temp-write');

const settlementSet = {
  General: '60d_SCED_Gen_Resource_Data',
  Resource: '60d_SCED_SMNE_GEN_RES'
};

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

async function extractContents(zippedFile, inputFilters) {

  if (inputFilters === undefined ||
      inputFilters === null ||
      !Array.isArray(inputFilters)) {
    inputFilters = Object.values(settlementSet);
  }
  const filters = [...inputFilters];

  const files = await unzip({ input: zippedFile });
  const extractedFiles = files.map(async (file) => {
    if (filters.length === 0) {
      await fs.writeFile(file.name, file.buffer.toString());
      return file.name;
    }
    if ((new RegExp( filters.join( "|" ), "i")).test(file.name)) {
      await fs.writeFile(file.name, file.buffer.toString());
      return file.name;
    }
    return null;
  });
  const newFiles = await Promise.all(extractedFiles);
  return newFiles.filter(z => z != null);
}

(async function() {
  const urls = await reader.extractSCEDUrls();
  const urlPromises = urls.map(async (url) => {
    return await extractContents(await downloadZipFile(url));
  });
  const extractedFiles = await Promise.all(urlPromises);
  console.log(extractedFiles);
})();
