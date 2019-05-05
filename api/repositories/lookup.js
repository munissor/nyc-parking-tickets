'use strict';

const Promise = require('bluebird');
const db = require('../clients/db');
const utils = require('./utils');

class LookupRepository {
  constructor(table, fields) {
    this.table = table;
    this.fields = fields;
  }

  async getById(id) {
    return this.get('id', id);
  }

  async get(key, value) {
    const results = await db.select('id', ...this.fields).from(this.table).where(key, value);
    return results[0];
  }

  async post(model) {
    if (utils.isIncomplete(model, this.fields)) {
      return Promise.reject(new Error('Missing model fields'));
    }

    return db(this.table).returning('id').insert(model);
  }

  async put(id, model) {
    if (utils.isIncomplete(model, this.fields)) {
      return Promise.reject(new Error('Missing model fields'));
    }

    return this.patch(id, model);
  }

  async patch(id, model) {
    return db(this.table).update(utils.toDbModel(model, this.fields)).where('id', id);
  }

  async del(id) {
    return db(this.table).where('id', id).del();
  }
}

module.exports = LookupRepository;
