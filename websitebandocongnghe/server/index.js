const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// 🔥 FIX PORT CHO REPLIT
const PORT = process.env.PORT || 3001;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ================= STATIC UPLOADS =================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= API =================
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.use('/api/admin', require('./api/admin'));
app.use('/api/customer', require('./api/customer'));

// ================= SERVE FRONTEND =================

// 🔥 ADMIN BUILD (ƯU TIÊN TRƯỚC)
app.use('/admin', express.static(path.join(__dirname, '../client-admin/build')));

// 🔥 ADMIN ROUTE
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client-admin/build/index.html'));
});

// 🔥 CUSTOMER BUILD (KHÔNG DÙNG '/')
app.use(express.static(path.join(__dirname, '../client-customer/build')));

// 🔥 CUSTOMER ROUTE
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client-customer/build/index.html'));
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});