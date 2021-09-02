require('dotenv').config();
const mongoose = require('mongoose');

/**
 * Environmental variables for database information
 */
const name = process.env.DB_USER || 'root';
const pass = process.env.DB_PASS || '';
const cluster = process.env.DB_CLUSTER;
const dbname = process.env.DB_NAME;

/**
 * connection to mongodb database.
 */
mongoose.connect(process.env.DB_CLUSTER ? `mongodb+srv://${name}:${pass}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority` : 'mongodb://localhost/neat-creats', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

// if error.
db.on('err', (err) => {
  console.error(err);
});

// if connection is successful.
db.once('open', () => {
  console.log('Database successfully connected!🚀');
});

module.exports = db;
