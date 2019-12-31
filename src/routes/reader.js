'use strict';

const cheerio = require('cheerio');
const axios = require('axios');
const ercotSCEDUrl = "http://mis.ercot.com/misapp/GetReports.do?reportTypeId=13052";


module.exports = {
    method: 'GET',
    path: '/sced',
    handler: (request, h) => {

    axios.get(ercotSCEDUrl).then((response) => {
      // Load the web page source code into a cheerio instance
      const $ = cheerio.load(response.data);
      const linkCells = $(".labelOptional_ind");
      const links = linkCells.map(z => {
        return z.text();
      });
      return links;
    });
  }
};