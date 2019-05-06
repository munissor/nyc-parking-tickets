'use strict';

module.exports = function (error) {
  if (!!error && !!error.httpStatusCode && error.httpStatusCode < 500) {
    return;
  }

  if (error) {
    error.message = `${error.message}: ${this.commandKey}`;
  }

  return error;
};
