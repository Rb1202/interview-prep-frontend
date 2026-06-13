# Interview Prep AI Frontend

React and Vite frontend for an AI-assisted interview preparation app.

## Features

- Account signup/login with cookie-based authenticated requests
- Dashboard for interview-prep sessions
- AI-generated Q&A based on role, experience and focus topics
- Pinned questions, notes and concept explanations
- Profile photo upload
- Route-level code splitting for smaller initial loads

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and point it at the backend API.

3. Start the dev server:

```bash
npm run dev
```

## Scripts

- `npm run dev`: Start Vite locally
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview the production build

## Environment Variables

- `VITE_BASE_URL`: Backend API URL, for example `http://localhost:5000`
