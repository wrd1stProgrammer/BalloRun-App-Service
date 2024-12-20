const jwt = require('jsonwebtoken');
// const Token 
const JWT_KEY = process.env.ACCESS_TOKEN_SECRET;


//exapmeple
exports.makeAccessToken = (object) => {
    return jwt.sign(object, JWT_KEY, { expiresIn: '100m' });
  };