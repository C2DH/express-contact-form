const request = require('supertest');
const assert = require('assert');
const app = require('../src/app');


/*
  Test your configuration easily with
  NODE_ENV=production DEBUG=express-con* mocha test/app.test.js
*/
describe('POST / with validation error', () => {
  it('respond with json', (done) => {
    request(app)
      .post('/ecf')
      .send({
        email: 'test@test.te',
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        assert.equal(res.body.errors[0].param, 'contents', 'expected contents');
        assert.equal(res.statusCode, 404, 'not valid');
        done();
      });
  });

  it('should fail recaptcha only', (done) => {
    request(app)
      .post('/ecf')
      .send({
        email: 'test@test.te',
        contents: 'test test',
        fullname: 'Test TEST',
        use: 'default',
        lang: 'en',
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        assert.ok(res.body.message, 'captcha message');
        assert.equal(res.body.message, 'Captcha validation failed');
        done();
      });
  });
});
