// This creates the Express app
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const Sequelize = require('sequelize');
const enableGlobalErrorLogging = false;
const { check, validationResult } = require('express-validator');
const route = require('./routes/routes');

app.use('/api', route)
app.use(express.json());

// This loads the bcryptjs package to encrypt and decrypt the password values
const bcrypt = require('bcryptjs');

// This is the Sequelize DB object 
app.set('models', require('./models'));

// This sends a 404 if no other route matched
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// This setsup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// This sets the port to 5000
app.set('port', process.env.PORT || 5000);

// This starts listening on the port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
module.exports = app;


