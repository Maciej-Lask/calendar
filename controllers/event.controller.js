const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime, description } = req.body;

    const newEvent = await prisma.event.create({
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
      },
    });

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, startTime, endTime, description } = req.body;

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
      },
    });

    res.json(updatedEvent);
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ message: 'Event not found.' });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Event deleted successfully.', event: deletedEvent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
