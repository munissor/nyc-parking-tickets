'use strict';

const LookupRepository = require('../repositories/lookup');
const BaseService = require('./base');

class LookupService extends BaseService {
  constructor(table) {
    super();
    this.repository = new LookupRepository(table, ['name']);
  }

  async get(id) {
    let item = await BaseService.fromCache(this.repository.table, id);

    if (!item) {
      item = await this.repository.getById(id);

      if (item) {
        await BaseService.setCache(this.repository.table, id, item);
      }
    }
    return item;
  }

  async post(model) {
    return this.repository.post(model);
  }

  async put(id, model) {
    await BaseService.invalidateCache(this.repository.table, id);
    return this.repository.put(id, model);
  }

  async patch(id, model) {
    await BaseService.invalidateCache(this.repository.table, id);
    return this.repository.patch(id, model);
  }

  async del(id) {
    await BaseService.invalidateCache(this.repository.table, id);
    return this.repository.del(id);
  }
}

module.exports = LookupService;
