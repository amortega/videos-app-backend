const express = require('express');
const boom = require('@hapi/boom');

const VideoService = require('./../services/videos.service');
const validatorHandler = require('./../middlewares/validator.handler');
const { initialCreationVideoSchema, getVideoSchema } = require('./../schemas/video.schema');

const router = express.Router();
const service = new VideoService();

router.get('/', async (req, res, next) => {
  try {
    const videos = await service.find();
    res.json(videos);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getVideoSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const video = await service.findOne(id);
      res.json(video);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(initialCreationVideoSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const external_id = service.getExternalId(body.youtube_url);
      if (!external_id) {
        throw boom.badRequest('URL inválida o no soportada.');
      }

      const video = await service.findOneForExternalId(external_id);

      if (video) {
        throw boom.badRequest('El video ingresado ya se encuentra creado en su lista de reproducción.');
      }

      try {
        const video = await service.searchApiYoutube(external_id);
        const newVideo = await service.create(video);
        return res.status(201).json(newVideo);
      } catch (error) {
        console.error(error);
        next(error);
      }

    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getVideoSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({id});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

