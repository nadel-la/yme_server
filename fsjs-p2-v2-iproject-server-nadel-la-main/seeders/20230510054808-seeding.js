"use strict";
const fs = require("fs");
const { hashPassword } = require("../helpers/bcrypt");
const { hash } = require("bcryptjs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const categories = JSON.parse(
      fs.readFileSync("./data/categories.json", "utf-8")
    ).map((c) => {
      delete c.id;
      c.createdAt = new Date();
      c.updatedAt = new Date();
      return c;
    });

    const mentors = JSON.parse(
      fs.readFileSync("./data/mentors.json", "utf-8")
    ).map((m) => {
      delete m.id;
      m.password = hashPassword(m.password);
      m.createdAt = new Date();
      m.updatedAt = new Date();
      return m;
    });

    await queryInterface.bulkInsert("Categories", categories, {});
    await queryInterface.bulkInsert("Mentors", mentors, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Categories", null, {});
    await queryInterface.bulkDelete("Mentors", null, {});
  },
};
