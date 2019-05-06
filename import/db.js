'use strict';

const knex = require('knex');
const config = require('config');
const db = knex({
  client: 'mysql2',
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
  },
  pool: { min: 1, max: 1 },
  debug: false
});

async function getLookupItem(table, key, keyName) {
  const k = keyName || 'name';
  const query = db.select('id').from(table).where(k, key);
  const result = await query;
  // lookup tables have unique constraints on name
  // so many result is not a possible case
  if (result.length === 1) {
    return result[0].id;
  }
  return null;
}

async function putLookupItem(table, key) {
  return db(table).insert({ name: key });
}

async function getStreet(name) {
  return getLookupItem('nyc_street', name);
}

async function putStreet(name) {
  return putLookupItem('nyc_street', name);
}

async function getPlateType(name) {
  return getLookupItem('plate_type', name);
}

async function putPlateType(name) {
  return putLookupItem('plate_type', name);
}

async function getState(name) {
  return getLookupItem('us_state', name);
}

async function putState(name) {
  return putLookupItem('us_state', name);
}

async function getVehicleBodyType(name) {
  return getLookupItem('vehicle_body_type', name);
}

async function putVehicleBodyType(name) {
  return putLookupItem('vehicle_body_type', name);
}

async function getVehicleMake(name) {
  return getLookupItem('vehicle_make', name);
}

async function putVehicleMake(name) {
  return putLookupItem('vehicle_make', name);
}

async function getVehicleColor(name) {
  return getLookupItem('vehicle_color', name);
}

async function putVehicleColor(name) {
  return putLookupItem('vehicle_color', name);
}

async function getCounty(name) {
  return getLookupItem('county', name);
}

async function putCounty(name) {
  return putLookupItem('county', name);
}

async function getPlate(number) {
  return getLookupItem('plate', number, 'plate');
}

async function putPlate(plate) {
  return db('plate').insert({ plate: plate.number, type_id: plate.typeId, registration_state_id: plate.stateId });
}

function putPlates(plates) {
  return new Promise((resolve, reject) => {
    db.transaction((trx) => {
      trx('plate')
        .insert(plates)
        .then((r) => {
          trx.commit();
          resolve(r);
        }).catch((e) => {
          trx.rollback();
          reject(e);
        });
    });
  });
}

async function putTickets(tickets) {
  return db('ticket').insert(tickets);
}

async function getTicket(number) {
  return getLookupItem('ticket', number, 'summon_number');
}

module.exports = {
  putStreet,
  getStreet,
  getPlateType,
  putPlateType,
  getState,
  putState,
  getPlate,
  putPlate,
  putPlates,
  getVehicleBodyType,
  putVehicleBodyType,
  getVehicleMake,
  putVehicleMake,
  getVehicleColor,
  putVehicleColor,
  getCounty,
  putCounty,
  getTicket,
  putTickets
};
