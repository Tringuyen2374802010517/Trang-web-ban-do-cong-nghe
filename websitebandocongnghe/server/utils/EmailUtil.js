const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

// 🔥 BASE URL (deploy)
const BASE_URL = "https://trang-web-ban-do-cong-nghe--techdevices2026.replit.app";

// ================= TRANSPORT =================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS
  }
});

module.exports = {

  // ================= SIGNUP ACTIVATION EMAIL =================
  async send(email, id, token) {

    try {

      const link = `${BASE_URL}/active?id=${id}&token=${token}`;

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
      return true;

    } catch (err) {
      console.log("EMAIL ERROR:", err.message);
      return false;
    }
  },

  // ================= ACCOUNT DEACTIVATED EMAIL =================
  async sendDeactive(email, name, id, token) {

    try {

      const link = `${BASE_URL}/active?id=${id}&token=${token}`;

      const text =
        `Hello ${name},\n\n` +
        `Your account has been deactivated by the administrator.\n\n` +
        `Please reactivate your account to continue using the system.\n\n` +
        `Click the link below to activate your account:\n${link}\n\n` +
        `Best regards.`;

      const info = await transporter.sendMail({
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: 'Account Deactivated',
        text
      });

      console.log("EMAIL DEACTIVATED SENT:", info.response);
      return true;

    } catch (err) {
      console.log("EMAIL ERROR:", err.message);
      return false;
    }
  }

};