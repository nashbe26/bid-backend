const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import your User model
const { verifyJwt } = require('../utils/jwt');
const { JWT_SECRET } = process.env;

const authJwt = async (req, res, next) => {

    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
  
    const tokenParts = authHeader.split(' ');
    console.log(authHeader);
    console.log(tokenParts[0]);
    if (tokenParts.length !== 2 || tokenParts[0] !== 'bearer') {
      return res.status(401).json({ error: 'Invalid token format.' });
    }
  
    const token = tokenParts[1];

  try {
    const decoded = verifyJwt(token);
    console.log(decoded.userId);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = user; // Store the user in req.user
    next();

  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = authJwt;
