'use strict';

const status = require('http-status');
const PlateService = require('../services/plate');

class PlateController {
  constructor() {
    this.service = new PlateService();
  }

  async get(req, res) {
    const id = parseInt(req.params.id);
    if (id) {
      try {
        const item = await this.service.get(id);
        if (!item) {
          res.status(status.NOT_FOUND).send();
        }
        else {
          res.status(status.FOUND).send(item);
        }
      }
      catch (e) {
        res.status(status.INTERNAL_SERVER_ERROR).send();
      }
    }
    else {
      res.status(status.BAD_REQUEST).send();
    }
  }

  async post(req, res) {
    const model = req.body;
    if (model) {
      try {
        const id = await this.service.post(model);
        res.status(status.CREATED).send(id);
      }
      catch (e) {
        res.status(status.INTERNAL_SERVER_ERROR).send();
      }
    }
    else {
      res.status(status.BAD_REQUEST).send();
    }
  }

  async put(req, res) {
    const model = req.body;
    const id = parseInt(req.params.id);
    if (id && model) {
      try {
        await this.service.put(id, model);
        res.status(status.NO_CONTENT).send();
      }
      catch (e) {
        res.status(status.INTERNAL_SERVER_ERROR).send();
      }
    }
    else {
      res.status(status.BAD_REQUEST).send();
    }
  }

  async patch(req, res) {
    const model = req.body;
    const id = parseInt(req.params.id);
    if (id && model) {
      try {
        await this.service.patch(id, model);
        res.status(status.NO_CONTENT).send();
      }
      catch (e) {
        res.status(status.INTERNAL_SERVER_ERROR).send();
      }
    }
    else {
      res.status(status.BAD_REQUEST).send();
    }
  }

  async del(req, res) {
    const id = parseInt(req.params.id);
    if (id) {
      try {
        await this.service.del(id);
        res.status(status.NO_CONTENT).send();
      }
      catch (e) {
        res.status(status.INTERNAL_SERVER_ERROR).send();
      }
    }
    else {
      res.status(status.BAD_REQUEST).send();
    }
  }
}

module.exports = PlateController;
