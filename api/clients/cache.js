'use strict';

const memcached = require('memcached');
const config = require('config');
const Promise = require('bluebird');
const cache = new memcached(config.cache.host, {});
const TTL = 600;

function promisify(context, fn, args) {
  return new Promise((resolve, reject) => {
    fn.call(context, ...args, (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  });
}

function get(key) {
  return promisify(cache, cache.get, [key]);
}

function getMulti(keys) {
  return promisify(cache, cache.getMulti, [keys]);
}

function set(key, item, ttl) {
  return promisify(cache, cache.set, [key, item, ttl || TTL]);
}

function del(key) {
  return promisify(cache, cache.del, [key]);
}

module.exports = {
  get,
  getMulti,
  set,
  del
};
