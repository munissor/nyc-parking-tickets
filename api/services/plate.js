'use strict';

const LookupRepository = require('../repositories/lookup');
const PlateRepository = require('../repositories/plate');
const BaseService = require('./base');

class PlateService extends BaseService {
  constructor() {
    super();
    this.repository = PlateRepository;
    this.typeRepository = new LookupRepository('plate_type', ['name']);
    this.stateRepository = new LookupRepository('us_state', ['name']);
    this.mappings = [
      { name: 'plate' },
      { name: 'plate_type', fk: 'type_id', repository: this.typeRepository },
      { name: 'registration_state', fk: 'registration_state_id', repository: this.stateRepository }
    ];
  }

  async _mapLinkedModels(model) {
    return BaseService._mapLinkedModels(model, this.mappings);
  }

  async get(id) {
    let item = await BaseService.fromCache(this.repository.table, id);
    if (!item) {
      item = await this.repository.getById(id);
    }

    if (item) {
      const cachePromise = BaseService.setCache(this.repository.table, id, item);

      item = await BaseService._flattenLinkedModels(item, this.mappings);

      await cachePromise;
    }

    return item;
  }

  async post(model) {
    const dbModel = await this._mapLinkedModels(model);
    return this.repository.post(dbModel);
  }

  async put(id, model) {
    await BaseService.invalidateCache(this.repository.table, id);
    const dbModel = await this._mapLinkedModels(model);
    return this.repository.put(id, dbModel);
  }

  async patch(id, model) {
    await this.invalidateCache(this.repository.table, id);
    const dbModel = await this._mapLinkedModels(model);
    return this.repository.patch(id, dbModel);
  }

  async del(id) {
    await this.invalidateCache(this.repository.table, id);
    return this.repository.del(id);
  }
}

module.exports = PlateService;
