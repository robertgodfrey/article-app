/* practice app to learn node and express */

const express = require('express');
const path = require('path');

// init app
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// home route
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Test'
  });
});

// add route
app.get('/articles/add', (req, res) => {
  res.render('add', {
    title: 'Add Article'
  });
});

// start server
app.listen(3000, () => {
  console.log('Server started on port 3000.');
});
