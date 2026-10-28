# Training Session Booking

SOFT7008 Project 1: basic Express/EJS pages, a MongoDB connection and an initial
booking model. Booking forms and listing are not implemented yet.

## Run locally

Use Node.js 24, npm 11 and a running MongoDB Community Server 8.0 instance.
Mongoose 9 requires Node.js 20.19 or newer and supports MongoDB 8.x.

```powershell
cd C:\faculdade\project1_SOFT7008
npm install
npm start
```

Open <http://localhost:3000>. Stop the server with Ctrl+C.
To install the exact dependency versions in `package-lock.json`, use `npm ci`.

If port 3000 is busy, choose another port in PowerShell:

```powershell
$env:PORT = '3001'
npm start
```

## Local MongoDB setup

Follow the [official Windows installation instructions](https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-windows/)
for MongoDB Community Server 8.0 on Windows 11 (64-bit). Install the server as a
Windows service named `MongoDB`. Compass and `mongosh` are optional for this
project; Mongoose can connect without either tool. The `mongod` executable is
the database server that stores documents on disk.

On this machine, MongoDB 8.0.34 is installed at
`C:\Program Files\MongoDB\Server\8.0`, and the `MongoDB` service is running with
automatic startup. Its configuration binds to `127.0.0.1:27017`. Compass and
`mongosh` were not installed. Database files remain outside this repository.

Check the service from PowerShell:

```powershell
Get-Service MongoDB
```

If the installed service is stopped, start it from an administrator PowerShell:

```powershell
Start-Service MongoDB
```

The default application URI is
`mongodb://127.0.0.1:27017/training_session_booking`. To choose another URI,
set it in the same PowerShell session before starting the application:

```powershell
$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/training_session_booking'
npm start
```

The application reads `process.env.MONGODB_URI` directly; it does not load `.env`
files. Keep credentials out of source code, commands shared with others and Git.
The connection code does not log the URI or the underlying driver error.

Startup waits for MongoDB before opening the HTTP port. If the initial connection
fails, it reports the failure and exits with code 1 after about five seconds
(malformed URIs can fail sooner). Start MongoDB or correct the URI, then run
`npm start` again. Loss of an established connection is reported in the console.
The booking schema disables operation buffering, so disconnected operations fail
instead of being queued until a connection appears.

## Structure and request flow

- `package.json`: dependency list and the `start` script.
- `bin/www`: connects to MongoDB, then listens on `PORT` (default 3000).
- `app.js`: configures EJS, static files, the router and error handling.
- `database.js`: connects Mongoose using the environment URI or the local default.
- `models/booking.js`: defines the initial booking Schema and exports its model.
- `routes/index.js`: GET routes for Home, About and Help.
- `views/`: EJS pages, with shared header and footer partials.
- `public/stylesheets/style.css`: responsive page styles.

`npm start` runs `node ./bin/www`, which imports `app.js` and calls the database
connection function. Once connected, the HTTP server starts. When a browser
requests `/about`, Express sends it to the router. The route calls
`res.render('about', ...)`, and EJS combines the template, title and partials
into HTML for the browser. A separate request loads the CSS through
`express.static`. Unmatched requests reach the 404 middleware; errors reach
the four-parameter error handler.

The structure follows the supplied Express skeleton, EJS materials, and pizza
and books examples. Express handles routes, EJS generates HTML, and Mongoose
provides the database connection, Schema and model. Express 4 keeps the routing
conventions used in the lectures; EJS 3 uses
`<%- include('partials/header') %>` for partials. The project uses CommonJS
(`require` and `module.exports`). Form middleware will be added with booking routes.

The booking Schema requires `personName` (String), `personId` (String of exactly
10 characters) and `sessionDateTime` (Date). `personId` is not unique and is not
restricted to digits. There is no future-date or duplicate-session rule.
`createdAt` is a Date with `default: Date.now`: passing the function lets Mongoose
calculate a fresh default for every new document. Calling `Date.now()` in the
Schema definition would calculate it only once when that file is loaded.

The exported `Booking` model is the interface for creating and querying booking
documents. Defining the model does not save a booking. Card fields are absent,
so the model is incomplete for final submission until the fictional-card
representation is settled with the lecturer.

## Manual checks

With the server running:

- Visit `/`, `/about` and `/help`; each should return its page.
- Follow the navigation links and check the current-page highlight.
- Open `/stylesheets/style.css`; it should return CSS.
- Visit `/missing-page`; it should return an error page with HTTP status 404.
- Check a narrow browser window: navigation should wrap and content should fit.

Verified on 28 October 2026 with Node.js 24.22.1, npm 11.19.1, Mongoose 9.11.4
and real MongoDB 8.0.34: required fields, ID lengths, date casting, the creation
date default, two fictional bookings sharing an alphanumeric ID, and reading
after reconnecting. Only those test records were deleted, using their returned
`_id` values. Disconnected model queries reject without buffering. Unreachable
servers and malformed URIs cause startup to exit with code 1 without HTTP startup
or credential logging. After real database startup, the three pages and CSS
returned HTTP 200, navigation markup passed, and an unknown route returned 404.
No test framework or permanent verification route was added. Visual checks,
including a narrow viewport, remain pending.

## Progress

- [x] Express/EJS setup and startup script.
- [x] Home, About and Help with shared navigation.
- [x] Responsive CSS and basic 404/server error handling.
- [ ] Booking form and creation.
- [x] Initial Mongoose booking model and database connection code.
- [x] Real MongoDB connection and persistence verification with fictional records.
- [ ] Existing booking list.

Editing, deletion, reports and detailed schema validation belong to Phase 2.
Card fields are deferred until the demonstration-data requirements are clarified
with the lecturer. Future work must use fictional card data, without real
payments or storage of real card security codes.
