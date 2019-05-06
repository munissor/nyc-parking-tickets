/* eslint-disable no-console */
/* eslint-disable prefer-template */
/* eslint-disable prefer-arrow-callback */

'use strict';

const hystrixSSEStream = require('hystrixjs').hystrixSSEStream;

module.exports = function () {
  return function (req, res) {
    res.append('Content-Type', 'text/event-stream;charset=UTF-8');
    res.append('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
    res.append('Pragma', 'no-cache');
    return hystrixSSEStream.toObservable().subscribe(
      function onNext(sseData) {
        res.write('data: ' + sseData + '\n\n');
      },
      function onError(error) {
        console.log(error);
      },
      function onComplete() {
        return res.end();
      }
    );
  };
};
