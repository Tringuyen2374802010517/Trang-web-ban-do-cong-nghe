const jwt = require('jsonwebtoken');
const MyConstants = require('./MyConstants');

module.exports = {

  genToken(payload) {

    const safePayload = {
      _id: payload._id
    };

    return jwt.sign(
      safePayload,
      MyConstants.JWT_SECRET,
      { expiresIn: MyConstants.JWT_EXPIRES }
    );
  },

  checkToken(req, res, next) {
    try {

      const authHeader = req.headers['authorization'];

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token format'
        });
      }

      const decoded = jwt.verify(token, MyConstants.JWT_SECRET);

      req.decoded = decoded;

      next();

    } catch (err) {

      console.error("JWT ERROR:", err);

      return res.status(401).json({
        success: false,
        message: 'Token invalid'
      });
    }
  }

};