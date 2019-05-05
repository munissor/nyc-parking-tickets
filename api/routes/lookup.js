'use strict';

const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const LookupController = require('../controllers/lookup');
const lookups = [{ table: 'county' }];

lookups.forEach((l) => {
  const controller = new LookupController(l.table);
  const path = l.path || l.table;

  router.get(`/${path}/:id`, asyncHandler(controller.get));
  router.post(`/${path}/`, asyncHandler(controller.post));
  router.put(`/${path}/:id`, asyncHandler(controller.put));
  router.patch(`/${path}/:id`, asyncHandler(controller.patch));
  router.delete(`/${path}/:id`, asyncHandler(controller.del));
});

