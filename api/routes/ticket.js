'use strict';

const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const TicketController = require('../controllers/ticket');
const controller = new TicketController();

router.get('/ticket/:id', asyncHandler(controller.get.bind(controller)));
router.post('/ticket/', asyncHandler(controller.post.bind(controller)));
router.put('/ticket/', asyncHandler(controller.put.bind(controller)));
router.patch('/ticket/', asyncHandler(controller.patch.bind(controller)));
router.delete('/ticket/', asyncHandler(controller.del.bind(controller)));

module.exports = router;

