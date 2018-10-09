'use strict';
const sequelize = require("./sequelize.js")
const Sequelize = require('sequelize')

const Category = sequelize.define('category', {
  category_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  parent_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "父级id"
  },
});

Category.sync(); //创建表

module.exports = Category;
