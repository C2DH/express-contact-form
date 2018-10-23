const assert = require('assert');
const config = require('config');
const mailer = require('../src/mailer');

const mailerConfig = config.get('nodemailer').default;
console.log(mailerConfig);
/*
  NODE_ENV=production DEBUG=express-con* mocha test/mailer.test.js
*/
describe('\'mailer\' test configuration', function () {
  this.timeout(5000);

  it('check configuration errors', () => {
    assert.ok(mailer, 'module loaded');
    assert.ok(mailerConfig.to, 'defaut TO missing');
    assert.ok(mailerConfig.from, 'defaut FROM missing');
  });

  it('send a test email according to configuration', async () => {
    const m = await mailer({
      from: mailerConfig.from,
      to: mailerConfig.to,
      text: 'hello world',
      html: '<b>hello</b> world',
      config: mailerConfig,
    }).catch((err) => {
      assert.fail(err);
    });

    console.log(m);
    assert.ok(m);
  });
});
