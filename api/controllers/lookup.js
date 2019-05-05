'use strict';

const status = require('http-status');
const LookupService = require('../services/lookup');

class LookupController {
  constructor(table) {
    this.repository = new LookupService(table);
  }

  async get(req, res) {
    const id = parseInt(req.param.id);
    if (id) {
      try {
        const item = await this.repository.get(id);
        if (!item) {
          res.status(status.NOT_FOUND).send();
        }
        else {
          res.status(status.FOUND).send();
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
        const id = await this.repository.post(model);
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
    const id = parseInt(req.param.id);
    if (id && model) {
      try {
        await this.repository.put(id, model);
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
    const id = parseInt(req.param.id);
    if (id && model) {
      try {
        await this.repository.patch(id, model);
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
    const id = parseInt(req.param.id);
    if (id) {
      try {
        await this.repository.del(id);
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

module.exports = LookupController;
