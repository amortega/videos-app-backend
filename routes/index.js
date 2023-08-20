const express = require('express');

const videosRouter = require('./videos.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/videos', videosRouter);
}

module.exports = routerApi;
