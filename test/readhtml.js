const jssoup = require('jssoup').default;
const axios = require('axios');
const ercotBaseUrl = 'http://mis.ercot.com/';

const reportLink = {
  url: new URL(`${ercotBaseUrl}misapp/GetReports.do?reportTypeId=13052`),
  validateParams: [
    "mimic_duns"
  ]
};

function refineLink(link) {
  let fullUrl =  new URL(link.attrs.href, ercotBaseUrl);
  (reportLink.validateParams || []).forEach(element => {
    if (fullUrl.searchParams.has(element) && Number(fullUrl.searchParams.get(element)) == 0) {
      fullUrl.searchParams.delete(element);
    }
  });
  return fullUrl;
}

function extractLink(link) { 
  const fullUrl = refineLink(link);
  const filteredParams = fullUrl.searchParams.toString();
  return new URL(`${fullUrl.protocol}//${fullUrl.host}${fullUrl.pathname}?${filteredParams}`);
};

async function readHTML() {
  const response = await axios.get(reportLink.url.href);
  const soup = new jssoup(response.data);
  const links = soup.findAll('a');
  return links.map(z => {
    return extractLink(z).href;
  });
};

module.exports = {
  extractSCEDUrls: readHTML,
  urlOptions: reportLink
};