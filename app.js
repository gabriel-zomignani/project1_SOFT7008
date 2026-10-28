const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const bookingsRouter = require('./routes/bookings');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);
app.use('/bookings', bookingsRouter);

// This runs only when no route or static file has answered the request.
app.use(function (req, res, next) {
  const error = new Error('Page not found');
  error.status = 404;
  next(error);
});

// Express recognises error middleware by its four parameters.
app.use(function (error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status || 500;
  const title = status === 404 ? 'Page not found' : 'Something went wrong';
  const message = status === 404
    ? 'We could not find that page. Use the navigation to continue.'
    : 'We could not complete your request. Please try again later.';

  if (status >= 500) {
    // Keep technical details in the server console, away from visitors.
    console.error(error);
  }

  res.status(status);
  res.render('error', { title, message, status, currentPage: '' });
});

module.exports = app;
