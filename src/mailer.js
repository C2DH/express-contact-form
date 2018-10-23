const mailer = require('nodemailer-promise');
const debug = require('debug')('express-contact-form/mailer');

// {
//   host: 'smtp.ethereal.email',
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//       user: account.user, // generated ethereal user
//       pass: account.pass // generated ethereal password
//   }
// });
//
module.exports = function ({
  from = null,
  subject = 'test',
  to = null,
  text = 'Hello world?',
  html = '<b>Hello world?</b>',
  config = {},
} = {}) {
  if (!from || !to) {
    throw new Error('configuration failure');
  }
  debug('sendMail configuration', config);
  const sendMail = mailer.config(config);
  debug('sendMail to', to);
  return sendMail({
    from,
    subject,
    to,
    text,
    html,
  });
};
