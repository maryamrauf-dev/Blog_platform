# Blogging Platform

A server-rendered blogging application built with Express, EJS, and MongoDB. Visitors can browse articles, while registered users can publish and manage their own posts.

## Features

- Browse recent articles without signing in
- Register and sign in with an email and password
- Sign in with Google OAuth
- Create, edit, view, and delete your own articles
- Protect account sessions with JWTs stored in HTTP-only cookies

## Technology

- Node.js and Express 5
- MongoDB with Mongoose
- EJS templates
- Passport.js with Google OAuth 2.0
- bcryptjs and JSON Web Tokens

## Requirements

- Node.js and npm
- A MongoDB database, local or hosted
- Google OAuth credentials if you want to enable Google sign-in

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file from the example:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell, use `Copy-Item .env.example .env` instead.

3. Set the values in `.env`:

   | Variable | Description |
   | --- | --- |
   | `MONGO_URI` | MongoDB connection string for the application database |
   | `JWT_SECRET` | A long, random secret used to sign authentication tokens |
   | `GOOGLE_CLIENT_ID` | Google OAuth client ID |
   | `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

   Google OAuth values are only needed for Google sign-in. In Google Cloud Console, configure `http://localhost:3000/auth/google/callback` as an authorized redirect URI for local development.

4. Start the application:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

The server listens on port `3000`. MongoDB connection status is reported in the server console.

## Main Routes

| Route | Description | Access |
| --- | --- | --- |
| `/` | Home page with recent articles | Public |
| `/articles` | Browse all articles | Public |
| `/articles/create` | Open the article editor | Signed-in users |
| `/my-articles` | Manage your articles | Signed-in users |
| `/register` | Create an account | Signed-out users |
| `/login` | Sign in | Signed-out users |
| `/auth/google` | Start Google sign-in | Optional OAuth setup |

Article detail, edit, and delete routes are available under `/articles/:id` and require authentication. Editing and deleting are restricted to the article's author.

## Project Structure

```text
config/       Passport and OAuth configuration
middleware/   Authentication middleware
models/       Mongoose user and article models
public/       Static assets, including CSS
routes/       Authentication and article routes
views/        EJS page templates
server.js     Express application entry point
```

## Deployment Notes

- Never commit `.env` or paste real credentials into source code. `.env.example` contains placeholders only.
- Set the environment variables through your hosting provider's secret or environment-variable settings.
- The Google OAuth callback URL is currently hard-coded to `http://localhost:3000/auth/google/callback` in `config/passport.js`. Update it to your deployed HTTPS URL and register that URL with Google before enabling OAuth in production.
- The application currently uses a fixed port (`3000`) and has a `dev` npm script; configure these for your hosting environment if it expects a dynamic port or a production start script.

## Development

Run `npm run dev` to start the server. The project does not currently define automated test or lint scripts.