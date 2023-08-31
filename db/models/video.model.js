const { Model, DataTypes, Sequelize } = require('sequelize');

const VIDEO_TABLE = 'videos';

const VideoSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  thumbnail_image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  external_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration_milliseconds: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  embed_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
}


class Video extends Model {

  static config(sequelize) {
    return {
      sequelize,
      tableName: VIDEO_TABLE,
      modelName: 'Video',
      timestamps: false
    }
  }
}

module.exports = { Video, VideoSchema, VIDEO_TABLE };
