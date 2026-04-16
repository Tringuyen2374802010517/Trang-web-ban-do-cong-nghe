const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // ✅ giữ tên gốc, thêm timestamp để tránh trùng
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const safeName = name.replace(/\s+/g, '-'); // bỏ dấu cách

    cb(null, `${safeName}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
