'use strict';

const config = require('config');
const dbClient = require('../clients/cache');
const hystrix = require('./hystrix');

function getFallback() {
  return null;
}

function getMultiFallback() {
  return null;
}

function setFallback(key, item, ttl) {
  return false;
}

function delFallback(key) {
  return false;
}

module.exports = hystrix.generateWrapper(dbClient, config.hystrix.cache, {}, {
  get: getFallback,
  getMulti: getMultiFallback,
  set: setFallback,
  del: delFallback
});

