const text = ({
  contents = '',
  email = '',
  fullname = '',
} = {}) => `
  Dear Staff Member,

  ${fullname} <${email}> left this message on the contact form:

  > ${contents}
  `;


const html = ({
  contents = '',
  email = '',
  fullname = '',
} = {}) => `
  <p>Dear Staff Member,</p>

  <p>${fullname} <${email}> left a message on the contact form:</p>

  <blockquote>${contents}</blockquote>
  `;

module.exports = {
  text,
  html,
};
