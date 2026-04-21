const express = require('express');
const router = express.Router();

require('../utils/MongooseUtil');

// DAOs
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');

// utils
const JwtUtil = require('../utils/JwtUtil');
const EmailUtil = require('../utils/EmailUtil');


// ================= CATEGORIES =================
router.get('/categories', async (req, res) => {
  try {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= PRODUCTS =================
router.get('/products', async (req, res) => {
  try {
    const products = await ProductDAO.selectAll();
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/products/new', async (req, res) => {
  try {
    const products = await ProductDAO.selectTopNew(3);
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/products/hot', async (req, res) => {
  try {
    const products = await ProductDAO.selectTopHot(3);
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/products/category/:cid', async (req, res) => {
  try {
    const products = await ProductDAO.selectByCatID(req.params.cid);
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/products/search/:keyword', async (req, res) => {
  try {
    const products = await ProductDAO.selectByKeyword(req.params.keyword);
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await ProductDAO.selectByID(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= SIGNUP =================
router.post('/signup', async (req, res) => {
  const { username, password, name, phone, email } = req.body;

  try {
    const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);

    if (dbCust) {
      return res.json({ success: false, message: 'Exists username or email' });
    }

    const token = JwtUtil.genToken({ _id: Date.now().toString() });

    const result = await CustomerDAO.insert({
      username,
      password,
      name,
      phone,
      email,
      active: 0,
      token
    });

    if (result) {
      await EmailUtil.send(email, result._id, token);
    }

    res.json({
      success: !!result,
      message: result
        ? 'Signup success! Please check your email to activate your account.'
        : 'Insert failure',
      id: result?._id,
      token
    });

  } catch (err) {
    console.log("Signup error:", err);
    res.status(500).json({ success: false });
  }
});


// ================= ACTIVE =================
router.post('/active', async (req, res) => {
  try {
    const { id, token } = req.body;

    if (!id || !token) {
      return res.json({ success: false });
    }

    const result = await CustomerDAO.active(id, token, 1);

    res.json({ success: !!result });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// ================= LOGIN (🔥 ĐÃ FIX CHUẨN) =================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ success: false, message: "Missing data" });
    }

    // 🔥 TÌM USER TRƯỚC
    const customer = await CustomerDAO.selectByUsername(username);

    // ❌ KHÔNG TỒN TẠI
    if (!customer) {
      return res.json({
        success: false,
        message: "Account not found"
      });
    }

    // ❌ SAI PASSWORD
    if (customer.password !== password) {
      return res.json({
        success: false,
        message: "Password is incorrect"
      });
    }

    // ❌ CHƯA ACTIVE
    if (customer.active !== 1) {
      return res.json({
        success: false,
        message: "Account is not active"
      });
    }

    // ✅ OK
    const token = JwtUtil.genToken({ _id: customer._id });

    res.json({
      success: true,
      token,
      customer
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// ================= CHECK TOKEN =================
router.get('/token', JwtUtil.checkToken, (req, res) => {
  res.json({ success: true });
});


// ================= UPDATE PROFILE =================
router.put('/customers/:id', JwtUtil.checkToken, async (req, res) => {
  try {
    const customer = await CustomerDAO.update({
      _id: req.params.id,
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    });

    res.json(customer || null);

  } catch (err) {
    res.status(500).json(null);
  }
});


// ================= CHECKOUT =================
router.post('/checkout', JwtUtil.checkToken, async (req, res) => {
  try {

    if (!req.body.items || req.body.items.length === 0) {
      return res.json({ success: false });
    }

    const order = {
      cdate: new Date().getTime(),
      total: req.body.total,
      status: 'PENDING',
      customer: req.decoded._id,
      items: req.body.items,

      address: req.body.address,
      deliveryType: req.body.deliveryType,
      selectedStore: req.body.selectedStore,
      paymentMethod: req.body.paymentMethod,
      note: req.body.note
    };

    const result = await OrderDAO.insert(order);

    res.json({
      success: true,
      order: result
    });

  } catch (err) {
    res.json({ success: false });
  }
});


// ================= MY ORDERS =================
router.get('/orders/customer/:cid', JwtUtil.checkToken, async (req, res) => {
  try {
    const orders = await OrderDAO.selectByCustID(req.params.cid);
    res.json(orders);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;