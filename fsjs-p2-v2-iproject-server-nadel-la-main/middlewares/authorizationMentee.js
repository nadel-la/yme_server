let { Mentee, Mentor } = require("../models");

const authorizationMentee = async (req, res, next) => {
  // console.log(req.user.role, '<<<<< dariii authorization');
  try {
    const id = req.user.id;
    // const idProduct = +req.params.id
    // console.log(idProduct, id);
    let findRole = await User.findByPk(id);
    if (findRole.role === "Admin") {
      next();
    } else {
      throw { name: "Forbidden" };
    }
    // console.log(findRole.role, '<<<<< findUser');
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

module.exports = authorizationMentee;
