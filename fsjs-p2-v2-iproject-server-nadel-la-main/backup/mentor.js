"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Mentor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Mentor.hasMany(models.Wishlist, { foreignKey: "mentorId" });
      Mentor.belongsTo(models.Category, { foreignKey: "categoryId" });
    }
  }
  Mentor.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Name is required`,
          },
          notEmpty: {
            msg: `Name is required`,
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: `Name is required`,
          },
          notEmpty: {
            msg: `Name is required`,
          },
          isEmail: {
            msg: `Email is invalid format`,
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Password is required`,
          },
          notEmpty: {
            msg: `Password is required`,
          },
        },
      },
      about: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `about is required`,
          },
          notEmpty: {
            msg: `about is required`,
          },
        },
      },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Rate is required`,
          },
          notEmpty: {
            msg: `Rate is required`,
          },
        },
      },
      instagram: DataTypes.STRING,
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `CategoryId is required`,
          },
          notEmpty: {
            msg: `CategoryId is required`,
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Mentor",
    }
  );
  Mentor.beforeCreate((data, options) => {
    data.password = hashPassword(data.password);
    return data;
  });
  return Mentor;
};
