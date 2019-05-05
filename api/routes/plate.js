'use strict';

const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const PlateController = require('../controllers/plate');
const controller = new PlateController();

router.get('/plate/:id', asyncHandler(controller.get.bind(controller)));
router.post('/plate/', asyncHandler(controller.post.bind(controller)));
router.put('/plate/', asyncHandler(controller.put.bind(controller)));
router.patch('/plate/', asyncHandler(controller.patch.bind(controller)));
router.delete('/plate/', asyncHandler(controller.del.bind(controller)));

module.exports = router;

