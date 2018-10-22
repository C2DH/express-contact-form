const express = require('express');

const app = express();

const bodyparser = require('body-parser');
const request = require('request');
const config = require('config');

const recaptcha = config.get('recaptcha');
const mailer = require('./mailer');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.post('/', (req) => {
  request({
    url: recaptcha.url,
    qs: {
      secret: recaptcha.secret,
      response: req.body['g-recaptcha-response'],
      remoteip: req.connection.remoteAddress,
    },
  }, (err, res, body) => {
    if (err) {
      return res.send({ message: 'geeric error' });
    }
    const b = JSON.parse(body);

    if (b.success !== undefined && !b.success) {
      mailer();
      return res.send({ message: 'Captcha validation failed' });
    }
    res.header('Content-Type', 'application/json');
    return res.send(b);
  });
});

module.exports = app;
