const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

const signToken = (payload) => {
  return jwt.sign(payload, secret);
};

const verifyToken = (access_token) => {
  return jwt.verify(access_token, secret);
};

module.exports = {
  signToken,
  verifyToken,
};
