const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS
  }
});

module.exports = {
  send(email, id, token) {
    const text =
      `Thanks for signing up.\n\n` +
      `ID: ${id}\n` +
      `TOKEN: ${token}\n\n` +
      `Use this to activate your account.`;

    return transporter.sendMail({
      from: MyConstants.EMAIL_USER,
      to: email,
      subject: 'Signup | Verification',
      text
    });
  }
};