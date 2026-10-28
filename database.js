const mongoose = require('mongoose');

function connectDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/training_session_booking';

  // A short timeout gives useful feedback when the local server is not running.
  return mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
}

// Do not print the URI or driver errors, which may contain credentials.
mongoose.connection.on('error', function () {
  console.error('MongoDB connection error. Check the database server and MONGODB_URI.');
});

mongoose.connection.on('disconnected', function () {
  console.error('MongoDB disconnected. Database operations are unavailable.');
});

module.exports = connectDatabase;
