const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const eventRoutes = require('./routes/events.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', eventRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const NODE_ENV = process.env.NODE_ENV;
let dbUri = '';

if (NODE_ENV === 'production') dbUri = 'url to remote db';
else if (NODE_ENV === 'test')
  dbUri = 'mongodb://localhost:27017/calendarDBtest';
else dbUri = 'mongodb://localhost:27017/calendarDB';

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  if (!process.env.env) {
    console.log('Connected to the database');
  }
});

db.on('error', (err) => {
  if (!process.env.env) {
    console.log('Error ' + err);
  }
});

const server = app.listen('8000', () => {
  if (!process.env.env) {
    console.log('Server is running on port: 8000');
  }
});

module.exports = server;
