const crypto = require('crypto');

module.exports = {
  md5(input) {
    return crypto.createHash('md5').update(input).digest('hex');
  }
};
