'use strict';

const Promise = require('bluebird');
const db = require('../clients/db');
const utils = require('./utils');
const TABLE = 'plate';
const FIELDS = ['plate', 'type_id', 'registration_state_id'];

async function get(id) {
  return db.select(...FIELDS).from(TABLE).where('id', id);
}

async function post(model) {
  if (utils.isIncomplete(model, FIELDS)) {
    return Promise.reject(new Error('Missing model fields'));
  }

  return db(this.table).returning('id').insert(utils.toDbModel(model));
}

async function put(id, model) {
  if (utils.isIncomplete(model, FIELDS)) {
    return Promise.reject(new Error('Missing model fields'));
  }

  return this.patch(id, model);
}

async function patch(id, model) {
  return db(this.table).update(utils.toDbModel(model)).where('id', id);
}

async function del(id) {
  return db(TABLE).where('id', id).del();
}

module.exports = {
  get,
  post,
  put,
  patch,
  del
};
