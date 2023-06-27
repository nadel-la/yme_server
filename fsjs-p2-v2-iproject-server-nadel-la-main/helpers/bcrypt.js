var bcrypt = require("bcryptjs");

const hashPassword = (password) => {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  return hash;
};

const comparePassword = (newPassword, hash) => {
  return bcrypt.compareSync(newPassword, hash);
};

module.exports = { hashPassword, comparePassword };
