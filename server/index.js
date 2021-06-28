const express = require('express');
const path = require('path');

// server PORT - will add a environmental variable later.
const PORT = 8080;
const app = express();

// app configurations
app.use(express.json());
app.use(express.static(path.resolve('./client', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve('./client', 'dist/index.html'));
});

// server listener to start server.
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
