'use strict';

const LookupRepository = require('./lookup');
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

module.exports = new LookupRepository(TABLE, FIELDS);
