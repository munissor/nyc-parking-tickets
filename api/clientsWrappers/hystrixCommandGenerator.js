'use strict';

const hystrix = require('hystrixjs');
const Promise = require('bluebird');
const defaultErrorHandler = require('./defaultErrorHandler');
const hystrixConfig = hystrix.hystrixConfig;
const commandFactory = hystrix.commandFactory;

hystrixConfig.init({
  'hystrix.promise.implementation': Promise
});

module.exports = {
  wrap: wrapCommand
};

function wrapCommand(key, run, options, errorHandler, fallbackHandler) {
  const cmdOptions = (!!options && !!options[key]) ? options[key] : {};
  const defaults = (!!options && !!options.defaults) ? options.defaults : {};

  const command = commandFactory
    .getOrCreate(key)
    .timeout(cmdOptions.executionTimeoutInMilliseconds || defaults.executionTimeoutInMilliseconds || hystrixConfig.executionTimeoutInMilliseconds)
    .run(run)
    .errorHandler(errorHandler || defaultErrorHandler)
    .circuitBreakerRequestVolumeThreshold(cmdOptions.circuitBreakerRequestVolumeThreshold || defaults.circuitBreakerRequestVolumeThreshold || hystrixConfig.circuitBreakerRequestVolumeThreshold)
    .circuitBreakerSleepWindowInMilliseconds(cmdOptions.circuitBreakerSleepWindowInMilliseconds || defaults.circuitBreakerSleepWindowInMilliseconds || hystrixConfig.circuitBreakerSleepWindowInMilliseconds)
    .statisticalWindowLength(cmdOptions.metricsStatisticalWindowInMilliseconds || defaults.metricsStatisticalWindowInMilliseconds || hystrixConfig.metricsStatisticalWindowInMilliseconds)
    .statisticalWindowNumberOfBuckets(cmdOptions.metricsStatisticalWindowBuckets || defaults.metricsStatisticalWindowBuckets || hystrixConfig.metricsStatisticalWindowBuckets);

  if (fallbackHandler) {
    command.fallbackTo(fallbackHandler);
  }

  return command.build();
}
