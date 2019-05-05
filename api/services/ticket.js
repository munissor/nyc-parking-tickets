'use strict';

const LookupRepository = require('../repositories/lookup');
const TicketRepository = require('../repositories/ticket');
const PlateRepository = require('../repositories/plate');
const BaseService = require('./base');
const PlateService = require('./plate');

class TicketService extends BaseService {
  constructor() {
    super();
    this.repository = TicketRepository;
    this.bodyTypeRepository = new LookupRepository('vehicle_body_type', ['name']);
    this.makeRepository = new LookupRepository('vehicle_make', ['name']);
    this.streetRepository = new LookupRepository('nyc_street', ['name']);
    this.colorRepository = new LookupRepository('vehicle_color', ['name']);
    this.countyRepository = new LookupRepository('plate_type', ['name']);
    this.plateRepository = PlateRepository;
    this.plateService = new PlateService();
    this.mappings = [
      { name: 'summons_number' },
      {
        fk: 'plate_id',
        mapToId: async (m) => {
          let plate = await this.plateRepository.get('plate', m.plate_number);
          if (!plate) {
            const id = await this.plateService.post({
              plate: m.plate_number,
              plate_type: m.plate_type,
              registration_state: m.registration_state
            });

            plate = {
              id: id
            };
          }
          return plate;
        },
        mapFromId: async (m, dbm) => {
          const plate = await this.plateService.get(m.plate_id);
          dbm.plate_number = plate.plate;
          dbm.plate_type = plate.plate_type;
          dbm.registration_state = plate.registration_state;
        }
      },
      { name: 'issue_date' },
      { name: 'violation_code' },
      { name: 'vehicle_body_type', fk: 'vehicle_body_type_id', repository: this.bodyTypeRepository },
      { name: 'vehicle_make', fk: 'vehicle_make_id', repository: this.makeRepository },
      { name: 'issuing_agency' },
      { name: 'street_code_1' },
      { name: 'street_code_2' },
      { name: 'street_code_3' },
      { name: 'vehicle_expiration_date' },
      { name: 'violation_location' },
      { name: 'violation_precinct' },
      { name: 'issuer_precinct' },
      { name: 'issuer_code' },
      { name: 'issuer_command' },
      { name: 'issuer_squad' },
      { name: 'violation_time' },
      { name: 'time_first_observed' },
      { name: 'violation_county', fk: 'violation_county_id', repository: this.countyRepository },
      { name: 'violation_in_front_or_opposit' },
      { name: 'house_number' },
      { name: 'street_name', fk: 'street_name_id', repository: this.countyRepository },
      { name: 'street_intersecting', fk: 'street_intersecting_id', repository: this.countyRepository },
      { name: 'date_first_observed' },
      { name: 'law_section' },
      { name: 'law_sub_division' },
      { name: 'violation_legal_code' },
      { name: 'days_parking_in_effect' },
      { name: 'from_hours_in_effect' },
      { name: 'to_hours_in_effect' },
      { name: 'vehicle_color', fk: 'vehicle_color_id', repository: this.colorRepository },
      { name: 'vehicle_unregistered' },
      { name: 'vehicle_year' },
      { name: 'meter_number' },
      { name: 'feet_from_curb' },
      { name: 'violation_post_code' },
      { name: 'violation_description' },
      { name: 'violation_no_standing_or_stopping' },
      { name: 'violation_hydrant' },
      { name: 'violation_double_parking' }
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

module.exports = TicketService;
