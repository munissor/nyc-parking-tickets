'use strict';

const fs = require('fs');
const Promise = require('bluebird');
const csv2 = require('csv2');
const through2 = require('through2');
const service = require('./service');
const field = {
  SUMMONS_NUMBER: 0,
  PLATE_NUMBER: 1,
  PLATE_REG_STATE: 2,
  PLATE_TYPE: 3,
  PLATE_ISSUE_DATE: 4,
  VIOLATION_CODE: 5,
  VEHICLE_BODY_TYPE: 6,
  VEHICLE_MAKE: 7,
  ISSUING_AGENCY: 8,
  STREET_CODE_1: 9,
  STREET_CODE_2: 10,
  STREET_CODE_3: 11,
  VEHICLE_EXPIRATION_DATE: 12,
  VIOLATION_LOCATION: 13,
  VIOLATION_PRECINCT: 14,
  ISSUER_PRECINCT: 15,
  ISSUER_CODE: 16,
  ISSUER_COMMAND: 17,
  ISSUER_SQUAD: 18,
  VIOLATION_TIME: 19,
  TIME_FIRST_OBSERVED: 20,
  VIOLATION_COUNTY: 21,
  VIOLATION_IN_FRONT_OR_OPPOSITE: 22,
  HOUSE_NUMBER: 23,
  STREET_NAME: 24,
  STREET_INTERSECTING: 25,
  DATE_FIRST_OBSERVED: 26,
  LAW_SECTION: 27,
  LAW_SUB_DIVISION: 28,
  VIOLATION_LEGAL_CODE: 29,
  DAYS_PARKING_IN_EFFECT: 30,
  FROM_HOURS_IN_EFFECT: 31,
  TO_HOURS_IN_EFFECT: 32,
  VEHICLE_COLOR: 33,
  VEHICLE_UNREGISTERED: 34,
  VEHICLE_YEAR: 35,
  METER_NUMBER: 36,
  FEET_FROM_CURB: 37,
  VIOLATION_POST_CODE: 38,
  VIOLATION_DESCRIPTION: 39,
  VIOLATION_NO_STANDING_OR_STOPPING: 40,
  VIOLATION_HYDRANT: 41,
  VIOLATION_DOUBLE_PARKING: 42
};

const nullableValues = {
  '': true,
  // eslint-disable-next-line quote-props
  '0': true,
  '-': true
};

function getFieldWithNullableValue(record, f) {
  const val = record[f];
  const nil = nullableValues[val];
  return nil ? null : val;
}

function getFrontOfOpposite(value) {
  const res = (value || '').toUpperCase();
  if (res === 'F' || res === 'O') {
    return res;
  }
  return null;
}

function getPlate(record) {
  return {
    number: record[field.PLATE_NUMBER],
    registrationState: record[field.PLATE_REG_STATE],
    type: record[field.PLATE_TYPE]
  };
}

if (process.argv.length !== 3) {
  // eslint-disable-next-line no-console
  console.log('Usage: import [file]');
}
else {
  const file = process.argv[2];
  // eslint-disable-next-line no-console
  console.log(`Importing ${file}`);

  let batch = [];
  const BATCH_SIZE = 1000;

  fs.createReadStream(file)
    .pipe(csv2())
    .pipe(through2.obj(function (record, enc, callback) {
      if (record[field.SUMMONS_NUMBER] === 'Summons Number') {
        callback();
        return;
      }

      const data = {
        summonsNumber: record[field.SUMMONS_NUMBER],
        plate: getPlate(record),
        issueDate: record[field.PLATE_ISSUE_DATE],
        violationCode: Number(record[field.VIOLATION_CODE]),
        vehicleBodyType: record[field.VEHICLE_BODY_TYPE],
        vehicleMake: record[field.VEHICLE_MAKE],
        issuingAgency: record[field.ISSUING_AGENCY],
        streetCode1: getFieldWithNullableValue(record, field.STREET_CODE_1),
        streetCode2: getFieldWithNullableValue(record, field.STREET_CODE_2),
        streetCode3: getFieldWithNullableValue(record, field.STREET_CODE_3),
        vehicleExpirationDate: getFieldWithNullableValue(record, field.VEHICLE_EXPIRATION_DATE),
        violationLocation: getFieldWithNullableValue(record, field.VIOLATION_LOCATION),
        violationPrecinct: getFieldWithNullableValue(record, field.VIOLATION_PRECINCT),
        issuerPrecinct: getFieldWithNullableValue(record, field.ISSUER_PRECINCT),
        issuerCode: getFieldWithNullableValue(record, field.ISSUER_CODE),
        issuerCommand: getFieldWithNullableValue(record, field.ISSUER_COMMAND),
        issuerSquad: getFieldWithNullableValue(record, field.ISSUER_SQUAD),
        violationTime: getFieldWithNullableValue(record, field.VIOLATION_TIME),
        timeFirstObserved: getFieldWithNullableValue(record, field.TIME_FIRST_OBSERVED),
        violationCounty: record[field.VIOLATION_COUNTY],
        violationInFrontOrOpposite: getFrontOfOpposite(getFieldWithNullableValue(record, field.VIOLATION_IN_FRONT_OR_OPPOSITE)),
        houseNumber: getFieldWithNullableValue(record, field.HOUSE_NUMBER),
        streetName: getFieldWithNullableValue(record, field.STREET_NAME),
        streetIntersecting: getFieldWithNullableValue(record, field.STREET_INTERSECTING),
        dateFirstObserved: getFieldWithNullableValue(record, field.DATE_FIRST_OBSERVED),
        lawSection: record[field.LAW_SECTION],
        subDivision: record[field.LAW_SUB_DIVISION],
        violationLegalCode: record[field.VIOLATION_LEGAL_CODE],
        daysParkingInEffect: getFieldWithNullableValue(field.DAYS_PARKING_IN_EFFECT),
        fromHoursInEffect: getFieldWithNullableValue(record, field.FROM_HOURS_IN_EFFECT),
        toHoursInEffect: getFieldWithNullableValue(record, field.TO_HOURS_IN_EFFECT),
        vehicleColor: record[field.VEHICLE_COLOR],
        vehicleUnregistered: getFieldWithNullableValue(record, field.VEHICLE_UNREGISTERED),
        vehicleYear: Number(record[field.VEHICLE_YEAR]),
        meterNumber: getFieldWithNullableValue(record, field.METER_NUMBER),
        feetFromCurb: Number(record[field.FEET_FROM_CURB]),
        violationPostCode: getFieldWithNullableValue(record, field.VIOLATION_POST_CODE),
        violationDescription: record[field.VIOLATION_DESCRIPTION],
        violationNoStandingOrStopping: getFieldWithNullableValue(record, field.VIOLATION_NO_STANDING_OR_STOPPING),
        violationHydrant: getFieldWithNullableValue(record, field.VIOLATION_HYDRANT),
        violationDoubleParking: getFieldWithNullableValue(record, field.VIOLATION_DOUBLE_PARKING)
      };

      this.push(data);
      callback();
    }))
    .pipe(through2.obj(function (data, enc, callback) {
      const self = this;
      Promise.all([
        data,
        service.getOrCreateStreet(data.streetName),
        service.getOrCreateStreet(data.streetIntersecting),
        service.getPlate(data.plate.number),
        service.getOrCreateState(data.plate.registrationState),
        service.getOrCreatePlateType(data.plate.type),
        service.getOrCreateVehicleBodyType(data.vehicleBodyType),
        service.getOrCreateVehicleMake(data.vehicleMake),
        service.getOrCreateVehicleColor(data.vehicleColor),
        service.getOrCreateCounty(data.violationCounty)
      ]).spread((d, street_name_id, street_intersecting_id, plate, registration_state_id, plate_type_id, vehicle_body_type_id, vehicle_make_id, vehicle_color_id, violation_county_id) => {
        const p = {
          _model: plate,
          number: d.plate.number,
          plate_type_id,
          registration_state_id
        };

        const model = {
          summons_number: d.summonsNumber,
          plate: p,
          issue_date: d.issueDate,
          violation_code: d.violationCode,
          vehicle_body_type_id,
          vehicle_make_id,
          issuing_agency: d.issuingAgency,
          street_code_1: d.streetCode1,
          street_code_2: d.streetCode2,
          street_code_3: d.streetCode3,
          vehicle_expiration_date: d.vehicleExpirationDate,
          violation_location: d.violationLocation,
          violation_precinct: d.violationPrecinct,
          issuer_precinct: d.issuerPrecinct,
          issuer_code: d.issuerCode,
          issuer_command: d.issuerCommand,
          issuer_squad: d.issuerSquad,
          violation_time: d.violationTime,
          time_first_observed: d.timeFirstObserved,
          violation_county_id,
          violation_in_front_or_opposit: d.violationInFrontOrOpposite,
          house_number: d.houseNumber,
          street_name_id,
          street_intersecting_id,
          date_first_observed: d.dateFirstObserved,
          law_section: d.lawSection,
          law_sub_division: d.subDivision,
          violation_legal_code: d.violationLegalCode,
          days_parking_in_effect: null,
          from_hours_in_effect: d.fromHoursInEffect,
          to_hours_in_effect: d.toHoursInEffect,
          vehicle_color_id,
          vehicle_unregistered: d.vehicleUnregistered,
          vehicle_year: d.vehicleYear,
          meter_number: d.meterNumber,
          feet_from_curb: d.feetFromCurb,
          violation_post_code: d.violationPostCode,
          violation_description: d.violationDescription,
          violation_no_standing_or_stopping: d.violationNoStandingOrStopping,
          violation_hydrant: d.violationHydrant,
          violation_double_parking: d.violationDoubleParking
        };

        if (batch.length < BATCH_SIZE) {
          batch.push(model);
        }
        else {
          self.push(batch);
          batch = [];
        }
        callback();
      });
    },
      (flush) => {
        this.push(batch);
        flush();
      }))
    .pipe(through2.obj((list, enc, callback) => {
      const uniquePlates = {};

      list.filter((v) => v.plate._model === null).forEach((i) => {
        const plateNumber = i.plate.number;
        if (uniquePlates[plateNumber]) {
          uniquePlates[plateNumber].tickets.push(i);
        }
        else {
          const t = {
            tickets: [i],
            plate: {
              plate: i.plate.number,
              type_id: i.plate.plate_type_id,
              registration_state_id: i.plate.registration_state_id
            }
          };
          uniquePlates[plateNumber] = t;
        }
      });

      list.filter((v) => v.plate._model !== null).forEach((i) => {
        i.plate_id = i.plate._model;
        delete i.plate;
      });

      const tickets = [];
      const plates = [];
      Object.keys(uniquePlates).forEach((k) => {
        tickets.push(uniquePlates[k].tickets);
        plates.push(uniquePlates[k].plate);
      });

      service.createPlates(plates)
        .then(() => {
          const promises = plates.map((p) => service.getPlate(p.plate));
          return Promise.all(promises);
        })
        .then((plt) => {
          tickets.forEach((t, index) => {
            t.forEach((i) => {
              i.plate_id = plt[index];
              delete i.plate;
            });
          });
          return service.createTickets(list);
        })
        .then()
        .catch((err) => {
          console.log(list);
          console.log(ticket);
          console.log(plates);
        })
        .finally(callback);
    }))
    .pipe(process.stdout);
}
