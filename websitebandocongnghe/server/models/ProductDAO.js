require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const ProductDAO = {

  // =====================
  // GET ALL
  // =====================
  async selectAll() {
    return await Models.Product
      .find({})
      .populate('categories_id')
      .exec();
  },

  // =====================
  // INSERT
  // =====================
  async insert(product) {

    product._id = new mongoose.Types.ObjectId();
    product.show = true;

    // FIX categories
    if (product.categories_id) {
      if (!Array.isArray(product.categories_id)) {
        product.categories_id = [product.categories_id];
      }

      product.categories_id = product.categories_id.map(
        id => new mongoose.Types.ObjectId(id)
      );
    }

    // FIX image
    if (product.images && product.images.length > 0) {
      product.images = product.images;
    }

    // 🔥 FIX SPECIFICATIONS (QUAN TRỌNG)
    product.battery = product.battery || '';
    product.year = product.year || '';
    product.compatible = product.compatible || '';
    product.feature = product.feature || '';
    product.port = product.port || '';
    product.size = product.size || '';
    product.weight = product.weight || '';
    product.brand = product.brand || '';

    return await Models.Product.create(product);
  },

  // =====================
  // UPDATE
  // =====================
  async update(product) {

    if (!mongoose.Types.ObjectId.isValid(product._id)) return null;

    const newvalues = {
      name: product.name,
      price: product.price,
      show: product.show,

      // 🔥 FIX SPECIFICATIONS
      battery: product.battery || '',
      year: product.year || '',
      compatible: product.compatible || '',
      feature: product.feature || '',
      port: product.port || '',
      size: product.size || '',
      weight: product.weight || '',
      brand: product.brand || ''
    };

    // FIX categories
    if (product.categories_id) {
      newvalues.categories_id = product.categories_id.map(
        id => new mongoose.Types.ObjectId(id)
      );
    }

    // FIX image
    if (product.images) {
      newvalues.images = product.images;
    }

    return await Models.Product.findByIdAndUpdate(
      product._id,
      newvalues,
      { new: true }
    );
  },

  // =====================
  // DELETE
  // =====================
  async delete(_id) {
    if (!mongoose.Types.ObjectId.isValid(_id)) return null;
    return await Models.Product.findByIdAndDelete(_id);
  },

  // =====================
  // SELECT BY ID
  // =====================
  async selectByID(_id) {
    if (!mongoose.Types.ObjectId.isValid(_id)) return null;

    return await Models.Product
      .findById(_id)
      .populate('categories_id')
      .exec();
  },

  // =====================
  // NEW PRODUCTS
  // =====================
  async selectTopNew(top) {
    return await Models.Product
      .find({ show: true })
      .sort({ _id: -1 })
      .limit(top)
      .exec();
  },

  // =====================
  // HOT PRODUCTS
  // =====================
  async selectTopHot(top) {
    return await Models.Product
      .find({ show: true })
      .sort({ price: -1 })
      .limit(top)
      .exec();
  },

  // =====================
  // BY CATEGORY
  // =====================
  async selectByCatID(cid) {
    if (!mongoose.Types.ObjectId.isValid(cid)) return [];

    return await Models.Product
      .find({
        categories_id: new mongoose.Types.ObjectId(cid),
        show: true
      })
      .populate('categories_id')
      .exec();
  },

  // =====================
  // SEARCH
  // =====================
  async selectByKeyword(keyword) {
    return await Models.Product
      .find({
        name: { $regex: new RegExp(keyword, "i") },
        show: true
      })
      .populate('categories_id')
      .exec();
  }

};

module.exports = ProductDAO;