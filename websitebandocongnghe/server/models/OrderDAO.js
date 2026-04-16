const mongoose = require('mongoose');
require('../utils/MongooseUtil');
const Models = require('./Models');

const OrderDAO = {

  // ================= INSERT ORDER =================
  async insert(order) {

    order._id = new mongoose.Types.ObjectId();

    // 🔥 FIX items
    order.items = order.items.map(item => {

      if (!item.product) {
        throw new Error("Product ID is missing");
      }

      const productId =
        typeof item.product === "object"
          ? item.product._id
          : item.product;

      return {
        product: new mongoose.Types.ObjectId(productId),
        quantity: item.quantity
      };
    });

    // 🔥 FIX customer
    if (!order.customer) {
      throw new Error("Customer ID is missing");
    }

    order.customer =
      typeof order.customer === "object"
        ? new mongoose.Types.ObjectId(order.customer._id || order.customer)
        : new mongoose.Types.ObjectId(order.customer);

    console.log("ORDER SAVE:", order);

    return await Models.Order.create(order);
  },


  // ================= GET ORDERS BY CUSTOMER =================
  async selectByCustID(_cid) {

    try {
      if (!_cid) return [];

      console.log("CID FROM FRONTEND:", _cid);

      const orders = await Models.Order
        .find({ customer: new mongoose.Types.ObjectId(_cid) }) // 🔥 FIX CHÍNH
        .sort({ cdate: -1 })
        .populate('items.product')
        .populate('customer')
        .exec();

      return orders;

    } catch (err) {
      console.error("ERROR selectByCustID:", err);
      return [];
    }
  },


  // ================= GET ALL (ADMIN) =================
  async selectAll() {

    const orders = await Models.Order
      .find({})
      .sort({ cdate: -1 })
      .populate('items.product')
      .populate('customer')
      .exec();

    console.log("ADMIN GET ORDERS:", orders);

    return orders;
  },


  // ================= UPDATE STATUS =================
  async update(_id, newStatus) {

    const result = await Models.Order.findByIdAndUpdate(
      _id,
      { status: newStatus },
      { new: true }
    );

    return result;
  }

};

module.exports = OrderDAO;