# DiveInc

Monorepo for the DiveInc dive-tour platform — three Express/Node.js services:

| Package | Description | Default port |
|---|---|---|
| [`diveinc-api`](diveinc-api/) | REST API (Express + Sequelize/PostgreSQL) | 3333 |
| [`diveinc-cms`](diveinc-cms/) | Admin panel (Express + EJS) | 4444 |
| [`diveinc-website`](diveinc-website/) | Public website (Express + EJS, gulp/sass build) | 5556 |

## Getting started

Each package is standalone — install and run from its own directory.

### diveinc-api

```bash
cd diveinc-api
npm install
# copy .env.example to .env and fill in DB / token values
node index.js
```

Required `.env` variables: `NODE_ENV`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`.
Optional: `HOST`, `PORT`, `TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `TOKEN_LIFE`, `REFRESH_TOKEN_LIFE`, `TOKEN_LINK_SECRET`, `TOKEN_LINK_LIFE`, `CMS_HOST`, `WEB_HOST`, `RFS_SIZE`, `RFS_TIME`.

Database schema lives in `api/data/migrations` (Sequelize CLI, see `.sequelizerc`).

### diveinc-cms

```bash
cd diveinc-cms
npm install
node index.js
```

Calls the API via `API_HOST` (defaults to `http://localhost:3333`).

### diveinc-website

```bash
cd diveinc-website
npm install
node index.js
```

Calls the API via `API_HOST` (defaults to `http://localhost:3333`). Uses `gulp` + `gulp-sass` for the asset build.

> Note: dependencies (e.g. `gulp-sass@4`) are legacy and work best on Node 14–16.
