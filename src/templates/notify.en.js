const text = ({
  content = '',
  email = '',
  fullname = '',
} = {}) => `
  Dear Staff Member,

  ${fullname} <${email}> left this message on the contact form:

  > ${content}
  `;


const html = ({
  content = '',
  email = '',
  fullname = '',
} = {}) => `
  <p>Dear Staff Member,</p>

  <p>${fullname} <${email}> left a message on the contact form:</p>

  <blockquote>${content}</blockquote>
  `;

module.exports = {
  text,
  html,
};
