const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {
  
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

db.once('open', () => {
  console.log('Connected to the MongoDB database');
});

module.exports = db;
