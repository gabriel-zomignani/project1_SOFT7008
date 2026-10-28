const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.render('index', { title: 'Home', currentPage: 'home' });
});

router.get('/about', function (req, res) {
  res.render('about', { title: 'About', currentPage: 'about' });
});

router.get('/help', function (req, res) {
  res.render('help', { title: 'Help', currentPage: 'help' });
});

module.exports = router;
