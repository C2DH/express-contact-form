/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const debug = require('debug')('express-contact-form/templates');

module.exports = ({
  language = 'en',
  name = 'test',
}) => require(`./${name}.${language}`);
