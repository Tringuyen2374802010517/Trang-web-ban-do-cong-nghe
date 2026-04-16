const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ================= STATIC UPLOADS =================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= TEST API =================
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// ================= ADMIN API =================
app.use('/api/admin', require('./api/admin'));

// ================= CUSTOMER API =================
app.use('/api/customer', require('./api/customer'));

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});