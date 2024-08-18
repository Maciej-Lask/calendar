const express = require('express');

const eventController = require('../controllers/event.controller'); 

const router = express.Router();


router.get('/events', eventController.getEvents);

router.post('/events', eventController.createEvent);

router.delete('/events/:id', eventController.deleteEvent);

module.exports = router;