"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Mentee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Mentee.hasMany(models.Wishlist, { foreignKey: "menteeId" });
      Mentee.belongsTo(models.Category, { foreignKey: "categoryId" });
    }
  }
  Mentee.init(
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
        unique: {
          msg: `Email has been registered`,
        },
        validate: {
          notNull: {
            msg: `Email is required`,
          },
          notEmpty: {
            msg: `Email is required`,
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
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Category Id is required`,
          },
          notEmpty: {
            msg: `Category Id is required`,
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Mentee",
    }
  );

  Mentee.beforeCreate((data, options) => {
    data.password = hashPassword(data.password);
    return data;
  });
  return Mentee;
};
