const express = require('express');

const eventController = require('../controllers/event.controller'); 

const router = express.Router();


router.get('/events', eventController.getEvents);

router.post('/events', eventController.createEvent);

router.put('/events/:id', eventController.updateEvent);

router.delete('/events/:id', eventController.deleteEvent);

module.exports = router;