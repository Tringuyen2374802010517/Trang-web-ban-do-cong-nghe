const mongoose = require('mongoose');

// ================= ADMIN =================
const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  phone: String,
  email: String,
  active: Boolean
});

// ================= CATEGORY =================
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  show: {
    type: Boolean,
    default: true
  }
});

// ================= PRODUCT =================
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  images: {
    type: [String],
    default: []
  },

  show: {
    type: Boolean,
    default: true
  },

  categories_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }],

  battery: { type: String, default: "" },
  year: { type: String, default: "" },
  compatible: { type: String, default: "" },
  feature: { type: String, default: "" },
  port: { type: String, default: "" },
  size: { type: String, default: "" },
  weight: { type: String, default: "" },
  brand: { type: String, default: "" }
});

// ================= CUSTOMER =================
const CustomerSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  phone: String,
  email: String,
  active: Number,
  token: String
});

// ================= ORDER =================
const OrderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  cdate: Number,
  total: Number,
  status: String,

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number
    }
  ],

  // 🔥 THÊM ĐÚNG 5 FIELD (KHÔNG ĐỤNG PHẦN KHÁC)
  address: String,
  deliveryType: String,
  selectedStore: String,
  paymentMethod: String,
  note: String
});

// ================= EXPORT =================
module.exports = {
  Admin: mongoose.model('Admin', AdminSchema),
  Category: mongoose.model('Category', CategorySchema),
  Product: mongoose.model('Product', ProductSchema),
  Customer: mongoose.model('Customer', CustomerSchema),
  Order: mongoose.model('Order', OrderSchema)
};