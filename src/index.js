/* eslint-disable no-console */
const config = require('config');
const app = require('./app');

const port = config.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) => console.error('Unhandled Rejection at: Promise ', p, reason));

server.on('listening', () => console.info('application started on port:', port));
