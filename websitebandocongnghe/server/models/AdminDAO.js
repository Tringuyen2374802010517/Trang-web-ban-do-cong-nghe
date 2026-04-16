require('../utils/MongooseUtil');
const Models = require('./Models');

module.exports = {
  async selectByUsernameAndPassword(username, password) {
    return Models.Admin.findOne({ username, password });
  }
};
