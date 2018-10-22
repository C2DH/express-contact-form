const assert = require('assert');
const mailer = require('../src/mailer');

describe('\'mailer\' test configuration', function () {
  this.timeout(5000);
  it('check configuration errors', () => {
    assert.ok(mailer, 'module loaded');
  });

  it('send a test email according to configuration', async () => {
    const m = await mailer().catch((err) => {
      assert.fail(err);
    });
    console.log(m);
    assert.ok(m);
  });
});
