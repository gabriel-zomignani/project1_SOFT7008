const express = require('express');
const Booking = require('../models/booking');
const router = express.Router();

function parseSessionDateTime(value) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return null;
  }

  // bin/www sets the process time zone to Europe/Dublin before loading routes.
  const date = new Date(value);
  const parts = value.split(/[-T:]/).map(Number);

  // Date can normalise impossible dates and skipped clock-change times.
  if (Number.isNaN(date.getTime()) ||
      date.getFullYear() !== parts[0] || date.getMonth() + 1 !== parts[1] ||
      date.getDate() !== parts[2] || date.getHours() !== parts[3] ||
      date.getMinutes() !== parts[4]) {
    return null;
  }

  return date;
}

router.get('/create', function (req, res) {
  res.render('bookings/create', {
    title: 'Create booking',
    currentPage: 'createBooking',
    errors: [],
    values: { personName: '', personId: '', sessionDateTime: '' }
  });
});

router.post('/create', function (req, res, next) {
  const body = req.body || {};
  // Repeated fields can arrive as arrays; accept only ordinary text values.
  const values = {
    personName: typeof body.personName === 'string' ? body.personName : '',
    personId: typeof body.personId === 'string' ? body.personId : '',
    sessionDateTime: typeof body.sessionDateTime === 'string' ? body.sessionDateTime : ''
  };
  const errors = [];
  const sessionDateTime = parseSessionDateTime(values.sessionDateTime);

  if (!values.personName.trim()) {
    errors.push('Enter a person name that is not blank.');
  }
  if (values.personId.length !== 10) {
    errors.push('Enter a person ID with exactly 10 characters.');
  }
  if (!sessionDateTime) {
    errors.push('Enter a valid session date and time in Dublin, including a time that exists when the clocks change.');
  }
  if (typeof body.demoCardNumber !== 'string' || body.demoCardNumber !== '4111111111111111') {
    errors.push('Use the sample demo card number shown below.');
  }
  if (typeof body.demoCardExpiry !== 'string' || body.demoCardExpiry !== '12/2030') {
    errors.push('Use the sample demo expiry shown below.');
  }
  if (typeof body.demoSecurityCode !== 'string' || body.demoSecurityCode !== '123') {
    errors.push('Use the sample demo security code shown below.');
  }

  if (errors.length > 0) {
    return res.status(400).render('bookings/create', {
      title: 'Create booking', currentPage: 'createBooking', errors, values
    });
  }

  // Select saved fields explicitly. The checked security code is discarded.
  Booking.create({
    personName: values.personName.trim(),
    personId: values.personId,
    sessionDateTime,
    demoCardNumber: body.demoCardNumber,
    demoCardExpiry: body.demoCardExpiry
  })
    .then(function (booking) {
      res.redirect(303, '/bookings?created=' + booking._id);
    })
    .catch(next);
});

router.get('/', function (req, res, next) {
  Booking.find().sort({ createdAt: -1, _id: -1 })
    .then(function (bookings) {
      // Show confirmation only when the referenced saved booking is in the list.
      const bookingCreated = bookings.some(function (booking) {
        return booking._id.toString() === req.query.created;
      });
      const dateFormatter = new Intl.DateTimeFormat('en-IE', {
        timeZone: 'Europe/Dublin',
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZoneName: 'short'
      });

      res.render('bookings/index', {
        title: 'Bookings', currentPage: 'bookings', bookings, bookingCreated,
        formatDate: function (date) { return dateFormatter.format(date); }
      });
    })
    .catch(next);
});

module.exports = router;
