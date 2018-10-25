const debug = require('debug')('express-contact-form/app');
const config = require('config');
const express = require('express');

const app = express();

const bodyparser = require('body-parser');
const request = require('request');

const { check, validationResult } = require('express-validator/check');

const recaptcha = config.get('recaptcha');
const redirect = config.get('redirect');
const mailerConfig = config.get('nodemailer');

const mailer = require('./mailer');
const templates = require('./templates');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

debug(`list of available configs: [${config.get('sites')}]`);

app.get('/ecf', (req, res) => {
  res.send('');
});
app.post('/ecf', [
  // username must be an email
  check('email').isEmail()
    .normalizeEmail(),
  // password must be at least 5 chars long
  check('contents').isLength({
    min: 1,
    max: 500,
  }),

  check('fullname').isLength({
    min: 1,
    max: 500,
  }),

  check('use').isIn(config.get('sites')),
  check('lang').isIn(config.get('languages')),
], (req, res, next) => {
  debug('POST body:', req.body);
  const site = req.body.use || 'default';
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsArray = errors.array();
    const errorsHash = errorsArray.map(d => `${d.param}=`).join('&');

    debug('errors', errorsArray);
    if (redirect[site].BadRequest) {
      return res.redirect(`${redirect[site].BadRequest}?err=b&${errorsHash}`);
    }
    return res.status(404).json({
      errors: errorsArray,
    });
  }
  return next();
}, (req, res) => {
  const site = req.body.use;
  // RECAPTCHA request here
  debug(`[${req.body.use}] POST remote: ${req.connection.remoteAddress}`);
  debug(`[${req.body.use}] POST body:`, req.body);

  request({
    url: recaptcha.url,
    qs: {
      secret: recaptcha[req.body.use].secret,
      response: req.body['g-recaptcha-response'],
      remoteip: req.connection.remoteAddress,
    },
  }, async (err, recaptchaResponse, recaptchaBody) => {
    if (err) {
      debug(err);
      if (redirect[req.body.use].GenericError) {
        return res.redirect(`${redirect[req.body.use].GenericError}?err=g`);
      }
      return res.status(500).json({
        message: 'generic error',
      });
    }
    const b = JSON.parse(recaptchaBody);

    if (b.success !== undefined && !b.success) {
      console.log(b);
      if (redirect[req.body.use].BadRequest) {
        return res.redirect(`${redirect[req.body.use].BadRequest}?err=captcha`);
      }
      return res.status(404).json({
        message: 'Captcha validation failed',
      });
    }

    const tmp = templates({
      name: 'notify',
      language: 'en',
    });

    // mail!
    await Promise.all([
      mailer({
        from: req.body.email,
        to: mailerConfig[site].to,
        text: tmp.text({
          content: req.body.content,
        }),
        html: tmp.html({
          content: req.body.content,
        }),
        config: mailerConfig[site],
      }),
    ]).catch((mailerError) => {
      debug('error', mailerError);
      if (redirect[req.body.use].GenericError) {
        return res.redirect(`${redirect[req.body.use].GenericError}?err=m`);
      }
      return res.status(500).json({
        message: 'mail error',
      });
    }).then((promiseResponses) => {
      console.log(promiseResponses);
      if (redirect[req.body.use].Success) {
        return res.redirect(redirect[req.body.use].Success);
      }
      return res.status(200).json({
        ...b,
        message: 'ok',
      });
    });


    //
    //
    // .then(() => {
    //   if (redirect[req.body.use].Success) {
    //     res.redirect(redirect[req.body.use].Success);
    //   } else {
    //     res.header('Content-Type', 'application/json');
    //     return res.send(b);
    //   }
    // })

    return res.end();
  });
});

module.exports = app;
