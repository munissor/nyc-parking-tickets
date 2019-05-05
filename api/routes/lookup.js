'use strict';

const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const LookupController = require('../controllers/lookup');
const lookups = [
  { table: 'county' },
  { table: 'plate_type', path: 'platetype' },
  { table: 'vehicle_make', path: 'vehicle/make' },
  { table: 'vehicle_body_type', path: 'vehicle/bodytype' },
  { table: 'vehicle_color', path: 'vehicle/color' },
  { table: 'us_state', path: 'state' },
  { table: 'nyc_street', path: 'street' }
];

lookups.forEach((l) => {
  const controller = new LookupController(l.table);
  const path = l.path || l.table;

  router.get(`/${path}/:id`, asyncHandler(controller.get.bind(controller)));
  router.post(`/${path}/`, asyncHandler(controller.post.bind(controller)));
  router.put(`/${path}/:id`, asyncHandler(controller.put.bind(controller)));
  router.patch(`/${path}/:id`, asyncHandler(controller.patch.bind(controller)));
  router.delete(`/${path}/:id`, asyncHandler(controller.del.bind(controller)));
});

module.exports = router;

