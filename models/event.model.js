const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  startTime: { type: Date, required: true }, 
  endTime: { type: Date, required: true }, 
  description: { type: String, required: true }, 
});

module.exports = mongoose.model('Event', eventSchema);
