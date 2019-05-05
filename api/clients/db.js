'use strict';

const knex = require('knex');
const config = require('config');
const db = knex({
  client: 'mysql2',
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
  }
});

module.exports = db;
