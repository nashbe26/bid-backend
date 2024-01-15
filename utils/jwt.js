const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = '99999h') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn});
};

const verifyJwt = (token) => {
    console.log(token);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      console.error(error);
      return null; // Return null for invalid tokens
    }
  };

module.exports = { generateToken,verifyJwt };