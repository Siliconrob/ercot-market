const fs = require('fs-extra');
const tempWrite = require('temp-write');
const csv = require('csvtojson');
const { DateTime } = require('luxon');

// const csv = require('csvtojson')
// const csvFilePath = 'data.csv'
// const array = await csv().fromFile(csvFilePath);

const settlementSet = {
  General: '60d_SCED_Gen_Resource_Data',
  Resource: '60d_SCED_SMNE_GEN_RES'
};

(async function() {

  const scedFile = "60d_SCED_SMNE_GEN_RES-02-JAN-20.csv";
  const data = await csv({
    colParser: {
      "Interval Value": "number",
      "Interval Number": "number",
      "Interval Time": (item, head, resultRow, row , colIdx) => {
        return DateTime.fromFormat(item, "MM/dd/yyyy HH:mm:ss", { zone: 'America/Chicago' }).toISO();
      },
      "Resource Code": "string"
    },
    checkType: true
  }).fromFile(scedFile);
  data.forEach(row => {
    console.log(row);
  });
})();
