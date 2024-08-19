
const express = require('express');
const cors = require('cors');

const eventRoutes = require('./routes/events.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/api', eventRoutes);

// Handle 404
app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

// Start the server
const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  if (NODE_ENV !== 'production') {
    console.log(`Server is running in ${NODE_ENV} mode on port: ${PORT}`);
  }
});

module.exports = app;
