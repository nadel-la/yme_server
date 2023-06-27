const { Mentee, Mentor, Category, Wishlist } = require("../models");
const { signToken, verifyToken } = require("../helpers/jwt");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { Op } = require("sequelize");

class CategoryController {
  static async fetchCategories(req, res) {
    try {
      let categories = await Category.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      res.status(500).json({ nessage: "Internal Server Error" });
    }
  }
}

module.exports = CategoryController;
