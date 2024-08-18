const Event = require('../models/event.model');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find(); 
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { name, startTime, endTime, description } = req.body;

    const newEvent = new Event({
      name,
      startTime,
      endTime,
      description,
    });

    await newEvent.save();

    res.status(201).json(newEvent); 
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res
        .status(404)
        .json({ message: 'Wydarzenie nie zostało znalezione.' });
    }

    res.json({ message: 'Wydarzenie zostało usunięte.', event: deletedEvent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
