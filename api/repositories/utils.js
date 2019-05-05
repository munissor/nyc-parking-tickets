'use strict';

function isIncomplete(model, fields) {
  return fields.find((f) => typeof model[f] === 'undefined') >= 0;
}

function toDbModel(model, fields) {
  const dbModel = {};
  fields.forEach((f) => {
    dbModel[f] = model[f];
  });
  return dbModel;
}

module.exports = {
  isIncomplete,
  toDbModel
};
