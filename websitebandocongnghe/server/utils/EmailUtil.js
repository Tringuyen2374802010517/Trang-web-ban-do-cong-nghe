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

  // ================= EMAIL KÍCH HOẠT (GIỮ NGUYÊN) =================
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
      return true;

    } catch (err) {
      console.log("EMAIL ERROR:", err.message);
      return false;
    }
  },

  // 🔥 THÊM MỚI: EMAIL BỊ KHÓA
  async sendDeactive(email, name, id, token) {

    try {

      const link = `http://localhost:3000/active?id=${id}&token=${token}`;

      const text =
        `Xin chào ${name},\n\n` +
        `Tài khoản của bạn đã bị vô hiệu hóa bởi admin.\n\n` +
        `Vui lòng kích hoạt lại tài khoản để tiếp tục sử dụng hệ thống.\n\n` +
        `Click link để kích hoạt:\n${link}\n\n` +
        `Trân trọng.`;

      const info = await transporter.sendMail({
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: 'Tài khoản bị vô hiệu hóa',
        text
      });

      console.log("EMAIL DEACTIVE SENT:", info.response);
      return true;

    } catch (err) {
      console.log("EMAIL ERROR:", err.message);
      return false;
    }
  }

};