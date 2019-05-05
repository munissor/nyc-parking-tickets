'use strict';

const LookupRepository = require('../repositories/lookup');
const cache = require('../clients/cache');

class LookupService {
  constructor(table) {
    this.repository = new LookupRepository(table);
  }

  key(id) {
    return `nyc-tickets-${this.table}-${id}`;
  }

  async invalidateCache(id) {
    try {
      cache.del(this.key(id));
    }
    // eslint-disable-next-line no-empty
    catch (e) { }
  }

  async fromCache(id) {
    try {
      return cache.get(this.key(id));
    }
    // eslint-disable-next-line no-empty
    catch (e) { }
    return null;
  }

  async setCache(id, model) {
    try {
      return cache.set(this.key(id), model);
    }
    // eslint-disable-next-line no-empty
    catch (e) { }
    return null;
  }

  async get(id) {
    let item = await this.fromCache(id);

    if (!item) {
      item = await this.repository.get(id);

      if (item) {
        await this.setCache(id, item);
      }
    }
    return item;
  }

  async post(model) {
    return this.repository.post(model);
  }

  async put(id, model) {
    await this.invalidateCache(id);
    return this.repository.put(id, model);
  }

  async patch(id, model) {
    await this.invalidateCache(id);
    return this.repository.patch(id, model);
  }

  async del(id) {
    await this.invalidateCache(id);
    return this.repository.del(id);
  }
}

module.exports = LookupService;
