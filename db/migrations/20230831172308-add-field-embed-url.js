'use strict';
const { VIDEO_TABLE } = require('../models/video.model');
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.addColumn(VIDEO_TABLE, 'embed_url',  { type: DataTypes.STRING, allowNull: true })
  },

  async down (queryInterface) {
    await queryInterface.removeColumn(VIDEO_TABLE, 'embed_url');
  }
};
