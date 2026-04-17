const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS
  }
});

module.exports = {
  async send(email, id, token) {

    try {

      const link = `http://localhost:3000/active?id=${id}&token=${token}`;

      const text =
        `Thanks for signing up.\n\n` +
        `===========================\n` +
        `MANUAL ACTIVATION:\n` +
        `ID: ${id}\n` +
        `TOKEN: ${token}\n\n` +
        `===========================\n` +
        `AUTO ACTIVATION (CLICK LINK):\n` +
        `${link}\n\n` +
        `===========================\n` +
        `You can use either method to activate your account.`;

      const info = await transporter.sendMail({
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: 'Signup | Verification',
        text
      });

      console.log("EMAIL SENT:", info.response);

    } catch (err) {
      console.log("EMAIL ERROR:", err.message);
    }

  }
};