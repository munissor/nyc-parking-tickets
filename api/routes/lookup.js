'use strict';

const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const LookupController = require('../controllers/lookup');
const lookups = [{ table: 'county' }];

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

