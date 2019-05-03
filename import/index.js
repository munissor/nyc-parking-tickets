const fs = require('fs');
const parse = require('csv-parse');
const moment = require('moment');
const transform = require('stream-transform');

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
  VIOLATION_DOUBLE_PARKING: 42,
};

// Street Code1            0
// Street Code2            0
// Street Code3            0
// Vehicle Expiration Date 0,
// Violation Location      ,
// Violation Precinct      0,
// Issuer Precinct         0,
// Issuer Code             0,
// Issuer Command          ,
// Issuer Squad            ,
// Violation Time          0143A,
// Time First Observed     ,
// Violation County        BX,
// Violation In FOO        ,
// House Number            ,
// Street Name             ALLERTON AVE (W/B) @,
// Intersecting Street     BARNES AVE,
// Date First Observed     0,
// Law Section             1111,
// Sub Division            D,
// Violation Legal Code    T,
// Days Parking In Effect  ,
// From Hours In Effect    ,
// To Hours In Effect      ,
// Vehicle Color           GY,
// Unregistered Vehicle?   ,
// Vehicle Year            2001,
// Meter Number            ,
// Feet From Curb          0,
// Violation Post Code     ,
// Violation Description   FAILURE TO STOP AT RED LIGHT,
// No Standing or Stopping Violation ,
// Hydrant Violation ,
// Double Parking Violation


const parser = parse({
  delimiter: ','
});

const plateCache = {};

const nullableValues = {
  '': true,
  '0': true
};
function getFieldWithNullableValue(record, field) {
  const val = record[field];
  const nil = nullableValues[val];
  return nil ? null : val;
}

function getPlate(record) {
  let plate = plateCache[record[field.PLATE_NUMBER]];
  if (!plate) {
    plate = {
      number: record[field.PLATE_NUMBER],
      registrationState: record[field.PLATE_REG_STATE],
      type: record[field.PLATE_TYPE],
      issueDate: moment(record[field.PLATE_ISSUE_DATE], 'MM/DD/YYYY'),
    }
    //plateCache[plate.number] = plate;
  }
  return plate;
}

const transformer = transform(function (record, callback) {
  if (record[field.SUMMONS_NUMBER] === "Summons Number")
    return;

  callback(null, {
    summonsNumber: record[field.SUMMONS_NUMBER],
    plate: getPlate(record),
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
    violationInFrontOrOpposite: getFieldWithNullableValue(record, field.VIOLATION_IN_FRONT_OR_OPPOSITE),
    houseNumber: getFieldWithNullableValue(record, field.houseNumber),
    streetName: record[field.STREET_NAME],
    streetIntersecting: record[field.STREET_INTERSECTING],
    dateFirstObserved: getFieldWithNullableValue(record, field.DATE_FIRST_OBSERVED),
    lawSection: record[field.LAW_SECTION],
    subDivision: record[field.LAW_SUB_DIVISION],
    violationLegalCode: record[field.VIOLATION_LEGAL_CODE],
    daysParkingInEffect: getFieldWithNullableValue(field.DAYS_PARKING_IN_EFFECT),
    fromHoursInEffect: getFieldWithNullableValue(record, field.FROM_HOURS_IN_EFFECT),
    toHoursInEffect: getFieldWithNullableValue(record, field.TO_HOURS_IN_EFFECT),
    vehicleColor: record[field.VEHICLE_COLOR],
    vehicleUnregistered: getFieldWithNullableValue(record, field.VEHICLE_UNREGISTERED),
    vehicleYear: record[field.VEHICLE_YEAR],
    meterNumber: getFieldWithNullableValue(record, field.METER_NUMBER),
    feetFromCurb: Number(record[field.FEET_FROM_CURB]),
    violationPostCode: getFieldWithNullableValue(record, field.VIOLATION_POST_CODE),
    violationDescription: record[field.VIOLATION_DESCRIPTION],
    violationNoStandingOrStopping: getFieldWithNullableValue(record, field.VIOLATION_NO_STANDING_OR_STOPPING),
    violationHydrant: getFieldWithNullableValue(record, field.VIOLATION_HYDRANT),
    violationDoubleParking: getFieldWithNullableValue(record, field.VIOLATION_DOUBLE_PARKING)
  });
});

transformer.on('data', function (data) {
  // TODO: save to DB
  console.log(data.summonsNumber);
})

if (process.argv.length != 3) {
  console.log('Usage: import [file]');
}
else {
  const file = process.argv[2];
  console.log(`Importing ${file}`);

  const stream = fs.createReadStream(file);
  stream.pipe(parser).pipe(transformer);
}
