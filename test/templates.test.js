const assert = require('assert');
const templates = require('../src/templates');

/*
  Test your configuration easily with
  DEBUG=express-con* mocha test/templates.test.js
*/
describe('simple mail template', () => {
  it('return text version', () => {
    const tmp = templates({
      language: 'en',
      name: 'notify',
    }).text({
      content: 'this is sample content',
      email: 'test@test.com',
    });

    assert.equal(
      tmp.split(/\s+/).join(' '),
      ' Dear Staff Member, <test@test.com> left this message on the contact form: > this is sample content ',
    );
  });
});
