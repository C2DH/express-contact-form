/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

module.exports = ({
  language = 'en',
  name = 'test',
}) => require(`./${name}.${language}`);
