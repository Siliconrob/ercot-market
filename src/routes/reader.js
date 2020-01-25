'use strict';

const reader = require('../../test/readhtml');


module.exports = {
    method: 'GET',
    path: '/sced',
    handler: (request, h) => {
      return (async () => {
        try {
          const urls = await reader.extractSCEDUrls();
          return {
            ercotUrls: urls
          };
        } catch (exc) {
          throw Boom.badRequest(exc);
        }
      })();
    }
  };