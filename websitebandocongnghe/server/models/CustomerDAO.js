require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const CustomerDAO = {

  // ================= FIND USERNAME OR EMAIL =================
  async selectByUsernameOrEmail(username, email) {
    const query = { $or: [{ username: username }, { email: email }] };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },

  // ================= INSERT CUSTOMER =================
  async insert(customer) {
    customer._id = new mongoose.Types.ObjectId();
    const result = await Models.Customer.create(customer);
    return result;
  },

  // ================= ACTIVE ACCOUNT =================
  async active(_id, token, active) {
    try {
      console.log("ACTIVE INPUT:", _id, token);

      const query = {
        _id: _id,                 // 🔥 KHÔNG ép ObjectId
        token: token + ''        // 🔥 ép về string
      };

      const update = {
        $set: { active: active }
      };

      const result = await Models.Customer.findOneAndUpdate(
        query,
        update,
        { new: true }
      );

      console.log("ACTIVE RESULT:", result);

      return result;

    } catch (err) {
      console.error("ACTIVE ERROR:", err);
      return null;
    }
  },

  // ================= LOGIN =================
  async selectByUsernameAndPassword(username, password) {
    const query = {
      username: username,
      password: password
    };

    const customer = await Models.Customer.findOne(query);
    return customer;
  },

  // ================= UPDATE PROFILE =================
  async update(customer) {
    const newvalues = {
      username: customer.username,
      password: customer.password,
      name: customer.name,
      phone: customer.phone,
      email: customer.email
    };

    const result = await Models.Customer.findByIdAndUpdate(
      customer._id,
      newvalues,
      { new: true }
    );

    return result;
  },

  // ================= GET ALL CUSTOMERS =================
  async selectAll() {
    const customers = await Models.Customer.find({}).exec();
    return customers;
  },

  // ================= GET CUSTOMER BY ID =================
  async selectByID(_id) {
    const customer = await Models.Customer.findById(_id).exec();
    return customer;
  }

};

module.exports = CustomerDAO;