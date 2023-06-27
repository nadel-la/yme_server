"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wishlist.belongsTo(models.Mentee, { foreignKey: "menteeId" });
      Wishlist.belongsTo(models.Mentor, { foreignKey: "mentorId" });
    }
  }
  Wishlist.init(
    {
      mentorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Mentor Id is required`,
          },
          notEmpty: {
            msg: `Mentor Id is required`,
          },
        },
      },
      menteeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Mentee Id is required`,
          },
          notEmpty: {
            msg: `Mentee Id is required`,
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Wishlist",
    }
  );
  return Wishlist;
};
