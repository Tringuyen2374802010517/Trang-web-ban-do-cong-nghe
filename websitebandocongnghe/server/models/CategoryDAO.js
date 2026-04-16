require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const CategoryDAO = {
  async selectAll() {
    return await Models.Category.find({}).exec();
  },

  async insert(category) {
    category._id = new mongoose.Types.ObjectId();
    return await Models.Category.create(category);
  },

  async update(category) {
    return await Models.Category.findByIdAndUpdate(
      category._id,
      { name: category.name },
      { new: true }
    );
  },

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid category id');
    }

    const result = await Models.Category.findByIdAndDelete(id);

    if (!result) {
      throw new Error('Category not found');
    }

    return result;
  }
};

module.exports = CategoryDAO;
