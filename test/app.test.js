const request = require('supertest');
const app = require('../src/app');


const assert = require('assert');

/*
  Test your configuration easily with
  NODE_ENV=production DEBUG=express-con* mocha test/app.test.js
*/
describe('POST / with validation error', function() {
  it('respond with json', function(done) {
    request(app)
      .post('/')
      .send({
        email: 'gui.daniele@gmail.com'
      })
      .set('Accept', 'application/json')
      .end(function(err, res) {
        assert.equal(res.body.errors[0].param, 'contents', 'expected contents');
        assert.equal(res.statusCode, 404, 'not valid');
        done();
      });
  });

  it('should fail recaptcha only', function(done) {
    request(app)
      .post('/')
      .send({
        email: 'gui.daniele@gmail.com',
        contents: 'test test',
      })
      .set('Accept', 'application/json')
      .end(function(err, res) {
        assert.ok(res.body.message, 'captcha message');
        assert.equal(res.body.message, 'Captcha validation failed');
        done();
      });

  })
});
