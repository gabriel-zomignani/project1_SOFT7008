# Training Session Booking

SOFT7008 Project 1: a Node.js, Express, EJS and MongoDB website for creating
and viewing training session bookings. It includes Home, About and Help pages,
form validation, shared navigation and responsive CSS.

## Requirements

- Node.js and npm.
- A running MongoDB server before starting the application.
- Internet access to install dependencies.

Tested on Windows 11 with Node.js 24.22.1, npm 11.19.1 and MongoDB 8.0.34.

## Run locally

Open a terminal in the project folder containing `package.json`. After extracting
the submission ZIP, this folder is named `training-session-booking`.

```powershell
npm ci
npm start
```

Open <http://localhost:3000>. Stop the application with Ctrl+C.
The application connects to MongoDB before starting its HTTP server.
The ZIP does not include Node.js, MongoDB or `node_modules`.

The default database URI is:
`mongodb://127.0.0.1:27017/training_session_booking`

To use another database, set `MONGODB_URI` in the same terminal before starting:

```powershell
$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/training_session_booking_demo'
npm start
```

If port 3000 is busy, set `$env:PORT = '3001'` before `npm start`.
Environment variables are read directly; `.env` files are not loaded.

## Main files and folders

- `app.js`: Express middleware, routers and error handling.
- `bin/www` and `database.js`: server startup and MongoDB connection.
- `routes/`: page routes and booking validation, creation and retrieval.
- `models/`: the Mongoose booking Schema and model.
- `views/`: EJS pages and shared header/footer partials.
- `public/`: the stylesheet.

## Demo card

Use only these fixed fictional details:

- Card number: `4111111111111111`.
- Expiry: `12/2030`.
- Security code: `123`.

This is the project's chosen demonstration approach. No payment is processed.
The fictional number and expiry are stored; the security code is checked but
not stored. Other card details are rejected. Card inputs are cleared after errors.

## Manual checks

- Create a fictional booking with ID `DEMO123456` and the demo card above.
  Check the confirmation and saved details on `/bookings`.
- Try IDs of 9 or 11 characters, an ID containing only spaces, missing fields
  or incorrect demo card details. Check the errors and preserved booking fields.
- Create two bookings with the same person ID; both should be allowed.
- Enter session times in Europe/Dublin time and check them in the list.
  Help explains seasonal clock changes.
- Restart the application and check that saved bookings remain available.
- Check navigation, form controls and booking details in a narrow browser window.
