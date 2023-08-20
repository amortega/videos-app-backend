const Joi = require('joi');

const id = Joi.number().integer();
const thumbnail_image = Joi.string().uri();
const title = Joi.string();
const description = Joi.string();
const external_id = Joi.string();
const duration = Joi.string();
const duration_milliseconds = Joi.number().integer();
const youtube_url = Joi.string().uri();

const createVideoSchema = Joi.object({
  thumbnail_image: thumbnail_image.required(),
  title: title.required(),
  description: description,
  external_id: external_id.required(),
  duration: duration.required(),
  duration_milliseconds: duration_milliseconds.required()
});

const initialCreationVideoSchema = Joi.object({
  youtube_url: youtube_url.required(),
});

const getVideoSchema = Joi.object({
  id: id.required(),
});

module.exports = { createVideoSchema, getVideoSchema, initialCreationVideoSchema }
