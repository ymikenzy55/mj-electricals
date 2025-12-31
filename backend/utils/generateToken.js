const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // Convert JWT_EXPIRE to proper format
  // If it's a string like "7d", keep it as is
  // If it's a number, convert to number
  let expiresIn = process.env.JWT_EXPIRE || '7d';
  
  // If it's a pure number string, convert to number (seconds)
  if (/^\d+$/.test(expiresIn)) {
    expiresIn = parseInt(expiresIn);
  }
  
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expiresIn
  });
};

module.exports = generateToken;
