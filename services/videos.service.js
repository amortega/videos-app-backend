const boom = require('@hapi/boom');
const axios = require('axios');
const Vimeo = require('vimeo').Vimeo;

const { models } = require('./../libs/sequelize');
const { createVideoSchema } = require('./../schemas/video.schema');

class VideoService {
  constructor() {}

  async create(data) {
    let newVideo = await models.Video.create(data);
    newVideo = {
      ...newVideo.dataValues,
      format_duration: this.getFormatDuration(newVideo.dataValues.duration_milliseconds)
    }
    return newVideo;
  }

  async find() {
    let rta = await models.Video.findAll();
    rta = rta.map((item) => {
      return {
        ...item.dataValues,
        format_duration: this.getFormatDuration(item.dataValues.duration_milliseconds)
      }
    });
    return rta;
  }

  async findOne(id) {
    const video = await models.Video.findByPk(id);
    if (!video) {
      throw boom.notFound('video not found');
    }
    return video;
  }

  async findOneForExternalId(external_id) {
    const video = await models.Video.findOne({ where: { external_id } });
    return video;
  }

  async delete(id) {
    const video = await this.findOne(id);
    await video.destroy();
    return { id };
  }

  async searchApiYoutube(external_id) {
    try {
      const response_youtube = await axios({
        method: 'GET',
        url: process.env.API_URL_YOUTUBE,
        params: {
          id: external_id,
          key: process.env.API_KEY_YOUTUBE,
          part: 'snippet,contentDetails'
        }
      });

      if (response_youtube.data.items.length) {
        const video = {
          title: response_youtube.data.items[0].snippet.title,
          description: response_youtube.data.items[0].snippet.description,
          thumbnail_image: response_youtube.data.items[0].snippet.thumbnails.medium.url,
          external_id: external_id,
          duration: response_youtube.data.items[0].contentDetails.duration,
          duration_milliseconds: this.convertYoutubeDurationToMilliseconds(response_youtube.data.items[0].contentDetails.duration),
          embed_url: `https://www.youtube.com/embed/${external_id}?autoplay=1`
        }

        const { error } = createVideoSchema.validate(video, { abortEarly: false });

        if (error) {
          throw boom.badRequest(error);
        }
        return video;
      }
      else {
        throw boom.notFound('El video buscado no existe.');
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response.data);
        throw boom.internal('Ha ocurrido un error, intente mas tarde.');
      }
      else {
        throw boom.badRequest(error);
      }

    }
  }

  async callApiVimeo(external_id) {
    return new Promise( (resolve, reject) => {
      let client = new Vimeo(process.env.CLIENT_ID_VIMEO, process.env.CLIENT_SECRET_VIMEO, process.env.API_KEY_VIMEO);
      client.request({
        method: 'GET',
        path: `videos/${external_id}`
      }, function (error, body) {
        if (error) {
          reject(false);
          return;
        }
        const { pictures, name, description, duration } = body;
        resolve({
          title: name,
          description,
          thumbnail_image: pictures.base_link,
          duration,
          external_id,
          duration_milliseconds: parseInt(duration * 1000),
          embed_url: body.player_embed_url + '&autoplay=1'
        });
      })
    });
  }

  getExternalId(url) {
    const pattern = /(?:https?:\/\/(?:www\.)?(?:vimeo\.com\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+))/g;
    const matches = url.matchAll(pattern);

    const videoIds = [...matches].map(match => match[1]);
    return videoIds.length ? videoIds[0] : null;
  }

  convertYoutubeDurationToMilliseconds(duration) {
    const time_extractor = /^P([0-9]*D)?T([0-9]*H)?([0-9]*M)?([0-9]*S)?$/i;
    const extracted = time_extractor.exec(duration);
    if (extracted) {
      const days = parseInt(extracted[1], 10) || 0;
      const hours = parseInt(extracted[2], 10) || 0;
      const minutes = parseInt(extracted[3], 10) || 0;
      const seconds = parseInt(extracted[4], 10) || 0;
      return (days * 24 * 3600 * 1000) + (hours * 3600 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
    }
    return 0;
  }

  getFormatDuration(milliseconds) {
    const days = parseInt(milliseconds / 24 / 3600 / 1000);
    milliseconds -= parseInt(days * 24 * 3600 * 1000);
    const hours = parseInt(milliseconds / 3600 / 1000);
    milliseconds -= parseInt(hours * 3600 * 1000);
    const minutos = parseInt(milliseconds / 1000 / 60);
    milliseconds -= minutos * 60 * 1000;
	  const segundos = (milliseconds / 1000);
    if (days > 0) return `${this.addZero(days)}D:${this.addZero(hours)}:${this.addZero(minutos)}:${this.addZero(segundos)}`;
    if (hours > 0) return `${this.addZero(hours)}:${this.addZero(minutos)}:${this.addZero(segundos)}`;
    return `${this.addZero(minutos)}:${this.addZero(segundos)}`;
  }

  addZero(value) {
    if (value < 10) {
      return "0" + value;
    } else {
      return "" + value;
    }
  }
}

module.exports = VideoService;
