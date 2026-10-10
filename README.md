# Memento — Blogging Platform

A server-rendered blogging application built with Express, EJS, and MongoDB. Visitors can browse and read articles freely. Registered users can publish and manage their own posts.

## Features

- Browse and read articles without signing in
- Register and sign in with email and password
- Sign in with Google OAuth
- Create, edit, and delete your own articles
- JWT-based sessions stored in HTTP only, `SameSite=Strict` cookies
- Rate-limited login and registration endpoints
- Server only starts after a confirmed database connection

## Technology

- Node.js and Express 5
- MongoDB with Mongoose
- EJS templates
- Passport.js with Google OAuth 2.0
- bcryptjs and JSON Web Tokens
- express-rate-limit

## Requirements

- Node.js 18+ and npm
- A MongoDB database (local or hosted, e.g. MongoDB Atlas)
- Google OAuth credentials (only needed for Google sign-in)

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create a local environment file:**

   ```bash
   # macOS / Linux
   cp .env.example .env

   # Windows PowerShell
   Copy-Item .env.example .env
   ```

3. **Fill in the values in `.env`:**

   | Variable | Description |
   | --- | --- |
   | `MONGO_URI` | MongoDB connection string |
   | `JWT_SECRET` | Long random secret for signing tokens |
   | `GOOGLE_CLIENT_ID` | Google OAuth client ID |
   | `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
   | `PORT` | Port to listen on (optional, defaults to `3000`) |
   | `NODE_ENV` | Set to `production` in production to enable secure cookies |

   > In Google Cloud Console, add `http://localhost:3000/auth/google/callback` as an authorized redirect URI for local development.

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000).

The server waits for a successful MongoDB connection before accepting requests. If the database is unreachable on startup, the process exits with an error.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the server (production) |
| `npm run dev` | Start the server (development) |

## Main Routes

| Route | Method | Description | Access |
| --- | --- | --- | --- |
| `/` | GET | Home page with recent articles | Public |
| `/articles` | GET | Browse all articles | Public |
| `/articles/:id` | GET | Read a single article | Public |
| `/articles/create` | GET | Open the article editor | Signed-in users |
| `/articles` | POST | Publish a new article | Signed-in users |
| `/articles/:id/edit` | GET / POST | Edit your article | Author only |
| `/articles/:id/delete` | POST | Delete your article | Author only |
| `/my-articles` | GET | Manage your articles | Signed-in users |
| `/register` | GET / POST | Create an account | Signed-out users |
| `/login` | GET / POST | Sign in | Signed-out users |
| `/logout` | POST | Sign out | Signed-in users |
| `/auth/google` | GET | Start Google sign-in | — |

Edit and delete actions are restricted to the article's author, enforced server-side.

## Rate Limits

| Endpoint | Limit |
| --- | --- |
| `POST /login` | 5 attempts per 15 minutes per IP |
| `POST /register` | 10 attempts per hour per IP |

## Project Structure

```text
config/       Passport and OAuth configuration
middleware/   Authentication and optional-auth middleware
models/       Mongoose user and post models
public/       Static assets (CSS)
routes/       Auth and article route handlers
views/        EJS page templates and partials
server.js     Application entry point
```

## Deployment

1. Set all environment variables in your hosting provider's dashboard — never commit `.env` to source control.
2. Set `NODE_ENV=production` so cookies are sent over HTTPS only (`Secure` flag enabled).
3. Set `PORT` if your host requires a specific port, or leave it unset — the app defaults to `3000`.
4. Use `npm start` as the start command.
5. Before enabling Google sign-in in production, register your deployed HTTPS callback URL (`https://yourdomain.com/auth/google/callback`) in Google Cloud Console and set `GOOGLE_CALLBACK_URL` in your environment variables.

### Process Management (recommended)

For zero-downtime restarts and automatic crash recovery, run the app under a process manager:

```bash
# Install PM2 globally
npm install -g pm2

# Start the app
pm2 start server.js --name memento

# Save the process list so it restarts on reboot
pm2 save
pm2 startup
```

## Development Notes

- The project does not currently define automated test or lint scripts.
- `NODE_ENV` is not set in the dev script, so cookies will work over plain HTTP on `localhost` during development.