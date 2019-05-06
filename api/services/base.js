'use strict';

const util = require('util');
const cache = require('../clientsWrappers/cache');
const CACHE_KEY = 'nyc-tickets-%s-%s';

class BaseService {
  static async _getOrCreateLookup(repository, name) {
    let item = await repository.get('name', name);
    if (!item) {
      const ids = await repository.post({ name });
      if (ids[0]) {
        item = {
          id: ids[0],
          name
        };
      }
    }
    return item;
  }

  static async _mapLinkedModels(model, fields) {
    const promises = fields.map((f) => {
      if (f.mapToId) {
        return f.mapToId(model);
      }

      const val = model[f.name];
      // if the field is not defined in the source model we do nothing
      if (typeof val === 'undefined') {
        return undefined;
      }

      // if the field doens't have a foreign key, resolve as it's value
      if (!f.fk) {
        return val;
      }

      // or else get or create the linked model
      return BaseService._getOrCreateLookup(f.repository, val);
    });

    const results = await Promise.all(promises);

    const dbModel = {};
    fields.forEach((f, index) => {
      const val = results[index];
      if (val) {
        if (f.fk && val.id) {
          dbModel[f.fk] = val.id;
        }
        else {
          dbModel[f.name] = val;
        }
      }
    });

    return dbModel;
  }

  static async _flattenLinkedModels(model, fields) {
    const dbModel = {};

    const promises = fields.map((f) => {
      if (f.mapFromId) {
        return f.mapFromId(model, dbModel);
      }

      if (!f.fk) {
        return model[f.name];
      }

      return BaseService.fromCache(f.repository.table, model[f.fk]);
    });

    const cachedValues = await Promise.all(promises);
    const results = await Promise.all(fields.map((f, index) => {
      const val = cachedValues[index];
      if (val) {
        return val;
      }

      if (f.repository && f.fk) {
        return f.repository.getById(model[f.fk]);
      }

      return val;
    }));

    fields.forEach((f, index) => {
      if (f.name) {
        if (f.repository && results[index]) {
          // we assume this is from a lookup table
          // if different values than names are required
          // change this code to get the value from the mappings
          dbModel[f.name] = results[index].name;
        }
        else if (!f.mapFromId) {
          dbModel[f.name] = results[index];
        }
      }
    });

    return dbModel;
  }

  static async invalidateCache(table, id) {
    const key = util.format(CACHE_KEY, table, id);
    try {
      cache.del(key);
    }
    // eslint-disable-next-line no-empty
    catch (e) { }
  }

  static async fromCache(table, id) {
    const key = util.format(CACHE_KEY, table, id);
    try {
      return cache.get(key);
    }
    // eslint-disable-next-line no-empty
    catch (e) { }
    return null;
  }

  static async setCache(table, id, model) {
    const key = util.format(CACHE_KEY, table, id);
    try {
      return cache.set(key, model);
    }
    // eslint-disable-next-line no-empty
    catch (e) { }
    return null;
  }
}

module.exports = BaseService;
