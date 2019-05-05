'use strict';

const Promise = require('bluebird');
const db = require('../clients/db');

class LookupRepository {
  constructor(table) {
    this.table = table;
  }

  async get(id) {
    const results = await db.select('id', 'name').from(this.table).where('id', id);
    return results[0];
  }

  async post(model) {
    return db(this.table).returning('id').insert({ name: model.name });
  }

  async put(id, model) {
    return this.patch(id, model);
  }

  async patch(id, model) {
    if (!model.name) {
      return Promise.reject(new Error('Missing model fields'));
    }

    return db(this.table).update({ name: model.name }).where('id', id);
  }

  async del(id) {
    return db(this.table).where('id', id).del();
  }
}

module.exports = LookupRepository;
