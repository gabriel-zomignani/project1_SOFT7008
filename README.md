# Training Session Booking

SOFT7008 Project 1: an Express/EJS website that creates training session bookings
in MongoDB and displays existing bookings. Card details remain an outstanding
assignment requirement, so Phase 1 is not complete.

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
- `routes/bookings.js`: GET form/list routes and the POST that validates and saves.
- `views/bookings/`: the booking form and list, with escaped EJS output.
- `views/`: EJS pages, with shared header and footer partials.
- `public/stylesheets/style.css`: responsive page styles.

`npm start` runs `bin/www`, which selects Europe/Dublin as the process time zone,
imports `app.js` and connects to MongoDB before starting HTTP. A GET to
`/bookings/create` renders the form. Its ordinary HTML POST sends named values;
`express.urlencoded({ extended: false })` makes them available in `req.body`.
The booking router checks their types and essential values, selects only the
three expected fields, and calls `Booking.create()`. The model supplies
`createdAt`. Success redirects with HTTP 303 to GET `/bookings`, which uses
`Booking.find()` and EJS to display saved records. A saved record ID in the query
string enables confirmation only when that record is present in the list.

Invalid submissions return HTTP 400 with clear errors and ordinary input values
preserved. Missing or repeated form fields are rejected. Database failures go
to the existing error handler without success or redirect. Static CSS is served
by `express.static`; unmatched routes reach the 404 handler.

The structure follows the supplied Express skeleton, EJS materials, and pizza
and books examples. Express handles routes, EJS generates HTML, and Mongoose
provides the database connection, Schema and model. Express 4 keeps the routing
conventions used in the lectures; EJS 3 uses
`<%- include('partials/header') %>` for partials. The project uses CommonJS
(`require` and `module.exports`). No new dependency was added for the form or list.

The booking Schema requires `personName` (String), `personId` (String of exactly
10 characters) and `sessionDateTime` (Date). `personId` is not unique and is not
restricted to digits. There is no future-date or duplicate-session rule.
`createdAt` is a Date with `default: Date.now`: passing the function lets Mongoose
calculate a fresh default for every new document. Calling `Date.now()` in the
Schema definition would calculate it only once when that file is loaded.

## Session date and time

The `datetime-local` field represents Europe/Dublin wall time, at minute
precision. `bin/www` sets `process.env.TZ = 'Europe/Dublin'` for this Node process;
it does not change the Windows time zone. `new Date(value)` converts that local
time to an instant stored in MongoDB. For example, 15 July 2026 at 18:30 in
Dublin is stored as `2026-07-15T17:30:00.000Z`. Winter offsets differ.

The router compares parsed date components with the submitted values to reject
impossible dates and spring clock-change times that do not exist. At the autumn
clock change, a repeated time uses its first occurrence. The form explains this
choice. The list uses `Intl.DateTimeFormat` with `timeZone: 'Europe/Dublin'` and
an offset label for session and creation times, so it displays Dublin time again.

## Manual checks

With the server running:

- Visit `/`, `/about` and `/help`; each should return its page.
- Follow the navigation links and check the current-page highlight.
- Open `/bookings/create`. Use a fictional name, ID `DEMO123456` and a Dublin
  session date/time, then select Save booking. The list should show confirmation.
- Open `/bookings` directly to see saved records, including after restarting.
- Try another booking with the same person ID; this is allowed.
- Try a blank name, ID of the wrong length or missing date; correct the errors.
- Open `/stylesheets/style.css`; it should return CSS.
- Visit `/missing-page`; it should return an error page with HTTP status 404.
- Check a narrow browser window: navigation should wrap and content should fit.

Verified on 28 October 2026 with Node.js 24.22.1, npm 11.19.1, Mongoose 9.11.4
and real MongoDB 8.0.34: an empty list, direct form/list access, form-style POSTs,
303 redirects, confirmation, repeated IDs and duplicate sessions, server-owned
creation dates, ID lengths of 9/10/11, missing/repeated fields, blank names,
invalid dates, escaped HTML-like names and IDs, Dublin summer/winter clock
offsets and autumn/spring clock changes. Invalid posts created no records.
Saved records appeared after an application restart. Only records created by
these checks were removed, using their returned `_id` values. Disconnected list
and save requests returned 500 without success. Existing pages, navigation, CSS
and 404 passed. No test framework or permanent check route was added.
Visual inspection, including a narrow viewport, remains pending because the
browser automation runtime failed to start in this environment.

## Progress

- [x] Express/EJS setup and startup script.
- [x] Home, About and Help with shared navigation.
- [x] Responsive CSS and basic 404/server error handling.
- [x] Booking form, server validation and creation in MongoDB.
- [x] Initial Mongoose booking model and database connection code.
- [x] Real MongoDB connection and persistence verification with fictional records.
- [x] Existing booking list and post-save redirect.
- [ ] Required card details using a representation agreed with the lecturer.
- [ ] Visual verification on desktop and narrow screens.

Editing, deletion, reports and detailed schema validation belong to Phase 2.
The required card fields remain deferred until the fictional-data representation
is clarified with the lecturer. The current model is incomplete for final
submission. Future work must use fictional card data, without real payments or
storage of real card security codes. Forms and listings currently cover the
person and session details only.
