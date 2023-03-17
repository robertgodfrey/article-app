/* practice app to learn node and express */

const express = require('express');
const path = require('path');

// init app
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// home route
app.get('/', (req, res) => {
  let articles = [
    {
      id: 1,
      title: 'Article One',
      author: 'Rob Godfrey',
      body: 'This is article one.'
    },
    {
      id: 2,
      title: 'Article Two',
      author: 'John Doe',
      body: 'This is article two.'
    },
    {
      id: 1,
      title: 'Article One',
      author: 'Rob Godfrey',
      body: 'This is article three.'
    }
  ];
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

