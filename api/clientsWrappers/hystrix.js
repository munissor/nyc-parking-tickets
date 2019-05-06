'use strict';

const commandGenerator = require('./hystrixCommandGenerator.js');
const streamBuilder = require('./hystrixStreamController.js');

module.exports = {
  buildStreamController: streamBuilder,
  generateWrapper: generateWrapper
};

function generateWrapper(obj, config, errorHandlers = {}, errorFallbacks = {}) {
  const wrapper = {};

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] !== 'function') {
      throw new Error(`Provided object contains a non function property: ${key}`);
    }

    const command = commandGenerator.wrap(key, obj[key], config, errorHandlers[key], errorFallbacks[key]);

    wrapper[key] = function () {
      return command.execute.apply(command, arguments);
    };
  });

  return wrapper;
}
