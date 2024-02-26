const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token ;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded.userId);
   
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    req.isAdmin = true;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authMiddleware;
