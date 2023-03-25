const express = require('express');
const Article = require('../models/article');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// add articles route
router.get('/add', (req, res) => {
  res.render('add_article', {
    title: 'Add Article'
  });
});

// edit article route
router.get('/edit/:id', async (req, res) => {
  try {
    res.render('edit_article', {
      article: await Article.findById(req.params.id)
    });
    return;
  } catch (err) {
    console.log(err);
  }
});

// submit article post route
router.post('/add', [
  check('title', 'Title is required').isLength({ min: 1 }),
  check('author', 'Author is required').isLength({ min: 1 }),
  check('body', 'Body is required').isLength({ min: 1 })
], async (req, res) => {

  // get errors
  let errors = validationResult(req);

  console.log(errors)
  if (!errors.isEmpty()) {
    res.render('add_article', {
      title: 'Add Article',
      errors: errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    try {
      article.save();
      console.log('Article submitted.');
      req.flash('success', 'Article Added');
      res.redirect('/');
    } catch (err) {
      console.log(err);
      return;
    }
  }
});

// update article post route
router.post('/edit/:id', async (req, res) => {
  let query = { _id: req.params.id };
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  try {
    await Article.updateOne(query, article);
    console.log('Article updated.');
    req.flash('success', 'Article Updated');
    res.redirect('/');
  } catch (err) {
    console.log(err);
    return;
  }


});

// delete route
router.delete('/:id', async (req, res) => {
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

// article route
router.get('/:id', async (req, res) => {
  try {
    res.render('article', {
      article: await Article.findById(req.params.id)
    });
    return;
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
