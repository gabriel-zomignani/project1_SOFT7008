# Training Session Booking

SOFT7008 Project 1, milestone 1: the Express/EJS application base and basic pages.

## Run locally

Use Node.js and npm. This milestone is verified with Node.js 24 and npm 11.

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

MongoDB is not needed for this milestone. Booking creation, booking lists and
MongoDB persistence are upcoming work.

## Structure and request flow

- `package.json`: dependency list and the `start` script.
- `bin/www`: creates the HTTP server and listens on `PORT` (default 3000).
- `app.js`: configures EJS, static files, the router and error handling.
- `routes/index.js`: GET routes for Home, About and Help.
- `views/`: EJS pages, with shared header and footer partials.
- `public/stylesheets/style.css`: responsive page styles.

`npm start` runs `node ./bin/www`, which imports `app.js`. When a browser
requests `/about`, Express sends it to the router. The route calls
`res.render('about', ...)`, and EJS combines the template, title and partials
into HTML for the browser. A separate request loads the CSS through
`express.static`. Unmatched requests reach the 404 middleware; errors reach
the four-parameter error handler.

The structure follows the supplied Express skeleton, EJS materials, and pizza
and books examples. Only Express 4 and EJS 3 are direct dependencies. Express 4
keeps the routing conventions used in the lectures; EJS 3 uses
`<%- include('partials/header') %>` for partials. The project uses CommonJS
(`require` and `module.exports`). Models and form middleware will be added
when bookings are implemented.

## Manual checks

With the server running:

- Visit `/`, `/about` and `/help`; each should return its page.
- Follow the navigation links and check the current-page highlight.
- Open `/stylesheets/style.css`; it should return CSS.
- Visit `/missing-page`; it should return an error page with HTTP status 404.
- Check a narrow browser window: navigation should wrap and content should fit.

Verified on 28 October 2026: dependency installation, startup, JavaScript syntax,
HTTP 200 for all three pages and CSS, navigation markup, HTTP 404 for an unknown
route, and HTTP 500 for a simulated render failure without exposing internal
error details. No test framework was added. Visual checks, including a narrow
viewport, remain pending because the available browser could not be automated.
No MongoDB tools were found on PATH, no MongoDB Windows service was found, and
the checked standard installation folders were absent; a custom installation
elsewhere has not been ruled out.

## Progress

- [x] Express/EJS setup and startup script.
- [x] Home, About and Help with shared navigation.
- [x] Responsive CSS and basic 404/server error handling.
- [ ] Booking form and creation.
- [ ] Mongoose model and MongoDB persistence.
- [ ] Existing booking list.

Editing, deletion, reports and detailed schema validation belong to Phase 2.
Card fields are deferred until the demonstration-data requirements are clarified
with the lecturer. Future work must use fictional card data, without real
payments or storage of real card security codes.
