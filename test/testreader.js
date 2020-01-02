const reader = require('./readhtml');

console.log(reader.urlOptions);

reader.extractSCEDUrls().then(links => {
  links.forEach(element => {
    console.log(element);
  });
});
