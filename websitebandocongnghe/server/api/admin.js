console.log("🔥 ADMIN API LOADED");
const express = require('express');
const router = express.Router();

const JwtUtil = require('../utils/JwtUtil');
const upload = require('../utils/upload');

const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');

// 🔥 THÊM
const CustomerDAO = require('../models/CustomerDAO');
const EmailUtil = require('../utils/EmailUtil');


// ================= ADMIN LOGIN =================
router.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;

    username = username?.trim();
    password = password?.trim();

    if (!username || !password) {
      return res.json({ success: false, message: 'Missing data' });
    }

    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);

    if (!admin) {
      return res.json({ success: false, message: 'Login failed' });
    }

    const token = JwtUtil.genToken({ username: admin.username });

    res.json({ success: true, token });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ================= CATEGORY =================

router.get('/categories', JwtUtil.checkToken, async (req, res) => {
  try {
    const categories = await CategoryDAO.selectAll();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/categories', JwtUtil.checkToken, async (req, res) => {
  try {
    const category = {
      name: req.body.name
    };

    const result = await CategoryDAO.insert(category);

    res.json({ success: true, category: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/categories/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    const category = {
      _id: req.params.id,
      name: req.body.name
    };

    const result = await CategoryDAO.update(category);

    res.json({ success: true, category: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/categories/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    await CategoryDAO.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ================= PRODUCT =================

router.get('/products', JwtUtil.checkToken, async (req, res) => {
  try {
    const products = await ProductDAO.selectAll();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔥 ADD PRODUCT
router.post('/products', JwtUtil.checkToken, upload.single('image'), async (req, res) => {
  try {

    console.log("BODY:", req.body); // 🔥 debug

    const product = {
      name: req.body.name,
      price: req.body.price,
      categories_id: req.body.categories_id ? [req.body.categories_id] : [],
      images: req.file ? [req.file.filename] : [],
      show: true,

      // ✅ THÊM THÔNG SỐ
      battery: req.body.battery,
      year: req.body.year,
      compatible: req.body.compatible,
      feature: req.body.feature,
      port: req.body.port,
      size: req.body.size,
      weight: req.body.weight,
      brand: req.body.brand
    };

    const result = await ProductDAO.insert(product);
    res.json({ success: true, product: result });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔥 UPDATE PRODUCT
router.put('/products/:id', JwtUtil.checkToken, upload.single('image'), async (req, res) => {
  try {

    console.log("BODY:", req.body); // 🔥 debug

    const product = {
      _id: req.params.id,
      name: req.body.name,
      price: req.body.price,
      categories_id: req.body.categories_id ? [req.body.categories_id] : [],
      show: req.body.show ?? true,

      // ✅ THÊM THÔNG SỐ
      battery: req.body.battery,
      year: req.body.year,
      compatible: req.body.compatible,
      feature: req.body.feature,
      port: req.body.port,
      size: req.body.size,
      weight: req.body.weight,
      brand: req.body.brand
    };

    if (req.file) {
      product.images = [req.file.filename];
    }

    const result = await ProductDAO.update(product);
    res.json({ success: true, product: result });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/products/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    await ProductDAO.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ================= ORDER =================

router.get('/orders', JwtUtil.checkToken, async (req, res) => {
  try {
    const orders = await OrderDAO.selectAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/orders/status/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    const result = await OrderDAO.update(req.params.id, req.body.status);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= CUSTOMER =================

router.get('/customers', JwtUtil.checkToken, async (req, res) => {
  try {
    const customers = await CustomerDAO.selectAll();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/orders/customer/:cid', JwtUtil.checkToken, async (req, res) => {
  try {
    const orders = await OrderDAO.selectByCustID(req.params.cid);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/customers/deactive/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    const result = await CustomerDAO.active(req.params.id, req.body.token, 0);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/customers/sendmail/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    const cust = await CustomerDAO.selectByID(req.params.id);

    if (!cust) {
      return res.json({ success: false, message: 'Not found' });
    }

    const send = await EmailUtil.send(cust.email, cust._id, cust.token);

    if (send) {
      res.json({ success: true, message: 'Please check email' });
    } else {
      res.json({ success: false, message: 'Email failure' });
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;