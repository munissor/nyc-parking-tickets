'use strict';

const LookupRepository = require('./lookup');
const TABLE = 'plate';
const FIELDS = ['plate', 'type_id', 'registration_state_id'];

module.exports = new LookupRepository(TABLE, FIELDS);
