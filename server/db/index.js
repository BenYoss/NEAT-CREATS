const mongoose = require('mongoose');

/**
 * connection to mongodb database.
 */
mongoose.connect('mongodb://localhost/neat-creats', { useNewUrlParser: true, useUnifiedTopology: true });

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
