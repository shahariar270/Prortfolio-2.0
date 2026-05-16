# Portfolio

A personal portfolio website built with a React + Vite frontend and an Express backend for handling contact form submissions.

## Overview

This repository contains two main parts:

- `client/` — React frontend using Vite, Sass, React Router, and Formik.
- `server/` — Express backend that receives contact form data and sends email notifications using Nodemailer.

The portfolio includes pages for Home, About, Skills, Projects, Blog, and Contact.

## Key Features

- Responsive portfolio layout with modern navigation
- Client-side routing using React Router
- SEO metadata support via `react-helmet-async`
- Contact form powered by Formik and server-side email sending
- Project filtering and interactive card UI for portfolio items
- Separate frontend and backend codebases for easier development

## Technologies

- Frontend
  - React 19
  - Vite
  - React Router DOM
  - Formik
  - react-helmet-async
  - Sass

- Backend
  - Express
  - CORS
  - dotenv
  - Nodemailer
  - nodemon

## Project Structure

```
client/
  package.json
  vite.config.js
  src/
    main.jsx
    route/index.jsx
    Component/
    Layout/
    Pages/
    assets/
    config/
server/
  app.js
  package.json
```

## Getting Started

### 1. Frontend Setup

```bash
cd client
npm install
npm run dev
```

By default, Vite development mode runs on `http://localhost:5173`.

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

The Express server uses `nodemon` for development and listens on `http://localhost:3000` by default.

## Environment Configuration

The backend uses `dotenv` in `server/app.js`, so you can store environment variables in `server/.env`.

Example `.env`:

```env
PORT=3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

> Note: The current `server/app.js` file contains a hardcoded Gmail auth object. For security, replace hardcoded credentials with environment variables and update `app.js` accordingly.

## Contact Form

The contact page sends POST requests to `http://localhost:3000/contact`.

The backend receives:

- `name`
- `email`
- `content`

Then it forwards the message using Nodemailer.

## Build for Production

### Frontend Build

```bash
cd client
npm run build
```

### Backend Production Start

```bash
cd server
node app.js
```

## Notes

- The backend dependency list includes `mongoose`, but the current server implementation does not use MongoDB.
- The frontend supports open-graph and SEO metadata via `client/src/config/seo.js`.
- Make sure the backend is running before using the contact form in the frontend.

## License

This repository does not define a license file.
