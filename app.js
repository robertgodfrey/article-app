/* practice app to learn node and express */

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

// check connection
db.once('open', () => console.log('Connected to MongoDB'));

// check for db errors
db.on('error', (err) => console.log(err));

// init app
const app = express();

// bring in models
let Article = require('./models/article')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// home route
app.get('/', async (req, res) => {
  let articles = {};
  try {
    articles = await Article.find();
  } catch (err) {
    console.log(err);
  }
  res.render('index', {
    title: 'Test',
    articles: articles
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

