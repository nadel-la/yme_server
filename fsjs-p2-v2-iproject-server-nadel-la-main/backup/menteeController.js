const { Mentee } = require("../models");

class MenteeController {
  static async register(req, res) {
    try {
      let { name, password, email } = req.body;
      const createUser = await Mentee.create({ name, password, email });
      res.status(201).json({
        id: createUser.id,
        name: createUser.name,
        email: createUser.email,
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        res.status(400).json({ message: err.errors[0].message });
      }
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = MenteeController;
