const { Video, VideoSchema } = require('./video.model');

function setupModels(sequelize) {
  Video.init(VideoSchema, Video.config(sequelize));
}

module.exports = setupModels;
