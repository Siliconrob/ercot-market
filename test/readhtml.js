const jssoup = require('jssoup').default;
const request = require('request');
const querystring = require('querystring');

const reportUrl = new URL('http://mis.ercot.com/misapp/GetReports.do?reportTypeId=13052');

function extractLink(link) {
  const fullUrl = new URL(`${reportUrl.protocol}//${reportUrl.host}${link.attrs.href}`);
  if (fullUrl.searchParams.has("mimic_duns") && Number(fullUrl.searchParams.get("mimic_duns")) == 0) {
    fullUrl.searchParams.delete("mimic_duns");
  }
  const filteredParams = fullUrl.searchParams.toString();  
  const parsedUrl = new URL(`${fullUrl.protocol}//${fullUrl.host}${fullUrl.pathname}?${filteredParams}`);
  return parsedUrl;
};

request(reportUrl.href, (error, response, body) => {
  console.error('error:', error);
  console.log('statusCode:', response && response.statusCode);
  //console.log('body:', body);
  let soup = new jssoup(body);
  let links = soup.findAll('a');
  links.map(z => {
    const link = extractLink(z);
    console.log(link.href);
  });
});