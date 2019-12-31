'use strict';

const Path = require('path');
const Hapi = require('@hapi/hapi');

const server = Hapi.Server({
  port: 3000,
  host: '0.0.0.0'
});

const init = async () => {
    await server.register({
      plugin: require('hapi-auto-route'),
      options: {
        routes_dir: Path.join(__dirname, 'routes')
      }
     });
    await server.start();
    console.log(`Server is running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();