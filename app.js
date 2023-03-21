/* practice app to learn node and express */

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// home route
app.get('/', async (req, res) => {
  try {
    res.render('index', {
      title: 'Test',
      articles: await Article.find()
    });
  } catch (err) {
    console.log(err);
  }
});

// article route
app.get('/article/:id', async (req, res) => {
  try {
    res.render('article', {
      article: await Article.findById(req.params.id)
    });
    return;
  } catch (err) {
    console.log(err);
  }
});

// add articles route
app.get('/articles/add', (req, res) => {
  res.render('add_article', {
    title: 'Add Article'
  });
});

// edit article route
app.get('/article/edit/:id', async (req, res) => {
  try {
    res.render('edit_article', {
      article: await Article.findById(req.params.id)
    });
    return;
  } catch (err) {
    console.log(err);
  }
})

// submit article post route
app.post('/articles/add', async (req, res) => {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  try {
    article.save();
    console.log('Article submitted.');
  } catch (err) {
    console.log(err);
    return;
  }

  res.redirect('/');
});

// update article post route
app.post('/articles/edit/:id', async (req, res) => {
  let query = { _id: req.params.id };
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  try {
    await Article.updateOne(query, article);
    console.log('Article updated.');
  } catch (err) {
    console.log(err);
    return;
  }

  res.redirect('/');
});

// delete route
app.delete('/article/:id', async (req, res) => {
  let query = { _id: req.params.id };
  try {
    await Article.deleteOne(query);
    console.log('Article deleted.');
    res.send('Success');
  } catch (err) {
    console.log(err);
    return;
  }
});

// start server
app.listen(3000, () => {
  console.log('Server started on port 3000.');
});

