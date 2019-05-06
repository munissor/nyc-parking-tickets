'use strict';

const Promise = require('bluebird');
const db = require('./db');
const streetCache = {};
const plateCache = {};
const plateTypeCache = {};
const stateCache = {};
const vehicleBodyTypeCache = {};
const vehicleMakeCache = {};
const vehicleColorCache = {};
const countyCache = {};

async function putStreet(key) {
  const id = db.putStreet(key);
  if (id) {
    streetCache[key] = id;
  }
  return id;
}

async function getStreet(key) {
  let id = streetCache[key];
  if (!id) {
    id = await db.getStreet(key);
  }
  return id;
}

async function getOrCreateStreet(key) {
  if (key == null) {
    return null;
  }
  let id = await getStreet(key);
  if (!id) {
    id = await putStreet(key);
  }
  return id;
}

async function putPlateType(key) {
  const id = await db.putPlateType(key);
  if (id) {
    plateTypeCache[key] = id;
  }
  return id;
}

async function getPlateType(key) {
  let id = plateTypeCache[key];
  if (!id) {
    id = await db.getPlateType(key);
  }
  return id;
}

async function getOrCreatePlateType(key) {
  let id = await getPlateType(key);
  if (!id) {
    id = await putPlateType(key);
  }
  return id;
}

async function putState(key) {
  const id = await db.putState(key);
  if (id) {
    stateCache[key] = id;
  }
  return id;
}

async function getState(key) {
  let id = stateCache[key];
  if (!id) {
    id = await db.getState(key);
  }
  return id;
}

async function getOrCreateState(key) {
  let id = await getState(key);
  if (!id) {
    id = await putState(key);
  }
  return id;
}

async function putCounty(key) {
  const id = await db.putCounty(key);
  if (id) {
    countyCache[key] = id;
  }
  return id;
}

async function getCounty(key) {
  let id = countyCache[key];
  if (!id) {
    id = await db.getCounty(key);
  }
  return id;
}

async function getOrCreateCounty(key) {
  let id = await getCounty(key);
  if (!id) {
    id = await putCounty(key);
  }
  return id;
}

async function putVehicleBodyType(key) {
  const id = await db.putVehicleBodyType(key);
  if (id) {
    vehicleBodyTypeCache[key] = id;
  }
  return id;
}

async function getVehicleBodyType(key) {
  let id = vehicleBodyTypeCache[key];
  if (!id) {
    id = await db.getVehicleBodyType(key);
  }
  return id;
}

async function getOrCreateVehicleBodyType(key) {
  let id = await getVehicleBodyType(key);
  if (!id) {
    id = await putVehicleBodyType(key);
  }
  return id;
}

async function putVehicleMake(key) {
  const id = await db.putVehicleMake(key);
  if (id) {
    vehicleMakeCache[key] = id;
  }
  return id;
}

async function getVehicleMake(key) {
  let id = vehicleMakeCache[key];
  if (!id) {
    id = await db.getVehicleMake(key);
  }
  return id;
}

async function getOrCreateVehicleMake(key) {
  let id = await getVehicleMake(key);
  if (!id) {
    id = await putVehicleMake(key);
  }
  return id;
}

async function putVehicleColor(key) {
  const id = await db.putVehicleColor(key);
  if (id) {
    vehicleColorCache[key] = id;
  }
  return id;
}

async function getVehicleColor(key) {
  let id = vehicleColorCache[key];
  if (!id) {
    id = await db.getVehicleColor(key);
  }
  return id;
}

async function getOrCreateVehicleColor(key) {
  let id = await getVehicleColor(key);
  if (!id) {
    id = await putVehicleColor(key);
  }
  return id;
}

async function getPlate(key) {
  let id = plateCache[key];
  if (!id) {
    id = await db.getPlate(key);
    plateCache[key] = id;
  }
  return id;
}

async function putPlate(plate) {
  const [typeId, stateId] = await Promise.all([
    getOrCreatePlateType(plate.type),
    getOrCreateState(plate.registrationState)
  ]);

  const id = await db.putPlate({ number: plate.number, typeId, stateId });

  if (id) {
    plateCache[plate.number] = id;
  }
  return id;
}

async function getOrCreatePlate(plate) {
  let id = await getPlate(plate.number);
  if (!id) {
    id = await putPlate(plate);
  }
  return id;
}

async function createPlates(plates) {
  return db.putPlates(plates);
}

async function createTickets(tickets) {
  return db.putTickets(tickets);
}

async function getTicket(ticket) {
  return db.getTicket(ticket);
}

module.exports = {
  getOrCreateStreet,
  getOrCreatePlate,
  getPlate,
  putPlate,
  createPlates,
  getOrCreatePlateType,
  getOrCreateState,
  getOrCreateVehicleBodyType,
  getOrCreateVehicleMake,
  getOrCreateVehicleColor,
  getOrCreateCounty,
  createTickets,
  getTicket
};
