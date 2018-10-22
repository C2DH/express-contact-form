const debug = require('debug')('express-contact-form/app');
const config = require('config');
const express = require('express');

const app = express();

const bodyparser = require('body-parser');
const request = require('request');

const { check, validationResult } = require('express-validator/check');

const recaptcha = config.get('recaptcha');
const redirect = config.get('redirect');
const mailer = require('./mailer');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


app.post('/', [
  // username must be an email
  check('email').isEmail(),
  // password must be at least 5 chars long
  check('contents').isLength({
    min: 5,
    max: 500,
  })
], (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if(redirect.BadRequest) {
      return res.redirect(redirect.BadRequest);
    } return res.status(404).json({
      errors: errors.array()
    });
  }
  debug('POST remote:', req.connection.remoteAddress);
  debug('POST body:', req.body);

  request({
    url: recaptcha.url,
    qs: {
      secret: recaptcha.secret,
      response: req.body['g-recaptcha-response'],
      remoteip: req.connection.remoteAddress,
    },
  }, (err, recaptchaResponse, body) => {
    if (err) {
      console.log(err);
      return res.status(404).json({
        message: 'generic error'
      });
    }
    const b = JSON.parse(body);

    if (b.success !== undefined && !b.success) {
      console.log(b)
      return res.status(404).json({
        message: 'Captcha validation failed'
      });
    }
    if(redirect.Success) {
      return res.redirect(redirect.Success);
    }
    res.header('Content-Type', 'application/json');
    return res.send(b);
  });
});

module.exports = app;
