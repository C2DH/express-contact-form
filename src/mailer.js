const config = require('config').get('nodemailer');
const mailer = require('nodemailer-promise');

const sendMail = mailer.config(config);
// {
//   host: 'smtp.ethereal.email',
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//       user: account.user, // generated ethereal user
//       pass: account.pass // generated ethereal password
//   }
// });

module.exports = function ({
  from = config.from,
  subject = 'test',
  to = config.to,
  text = 'Hello world?',
  html = '<b>Hello world?</b>',
} = {}) {
  if (!from || !to) {
    throw new Error('configuration failure');
  }
  console.log(config, subject, text, to, html, from);
  return sendMail({
    from,
    subject,
    to,
    text,
    html,
  });
};
