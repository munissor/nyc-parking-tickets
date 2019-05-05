'use strict';

const Promise = require('bluebird');
const db = require('../clients/db');
const utils = require('./utils');
const TABLE = 'ticket';
const FIELDS = [
  'summons_number',
  'plate_id',
  'issue_date',
  'violation_code',
  'vehicle_body_type_id',
  'vehicle_make_id',
  'issuing_agency',
  'street_code_1',
  'street_code_2',
  'street_code_3',
  'vehicle_expiration_date',
  'violation_location',
  'violation_precinct',
  'issuer_precinct',
  'issuer_code',
  'issuer_command',
  'issuer_squad',
  'violation_time',
  'time_first_observed',
  'violation_county_id',
  'violation_in_front_or_opposit',
  'house_number',
  'street_name_id',
  'street_intersecting_id',
  'date_first_observed',
  'law_section',
  'law_sub_division',
  'violation_legal_code',
  'days_parking_in_effect',
  'from_hours_in_effect',
  'to_hours_in_effect',
  'vehicle_color_id',
  'vehicle_unregistered',
  'vehicle_year',
  'meter_number',
  'feet_from_curb',
  'violation_post_code',
  'violation_description',
  'violation_no_standing_or_stopping',
  'violation_hydrant',
  'violation_double_parking'
];

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
