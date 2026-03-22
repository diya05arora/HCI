# Senior Care Companion (MERN)

Accessibility-first website for elderly users and people with low digital literacy.

## Key Features

- Large, clearly labeled home actions for Health Information, Medicine Reminders, and Emergency Contacts
- Simple language and card-based health tips with optional audio playback
- Medicine reminder cards with large checkboxes and clear `Taken` / `Not Taken` states
- Emergency contacts with one-tap red call buttons and confirmation popup
- Accessibility controls for text size, contrast mode, and language
- Secure authentication (register/login) for elderly users and caregivers
- Caregiver profile section to capture relationship, elder details, and care notes
- Separate auth page for Sign In / Create Account
- Separate medicines page with large filter menu (Not Taken, Taken, All Medicines)
- Mobile-friendly large-button navigation menu (no hamburger)

## Tech Stack

- MongoDB
- Express.js
- React (Vite)
- Node.js

## Project Structure

- `server/` Express + Mongoose API
- `client/` React frontend

## Prerequisites

- Node.js 18+
- MongoDB running locally or remotely

## Environment Variables

1. Create `server/.env` from `server/.env.example`
2. Create `client/.env` from `client/.env.example`

`server/.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hui_senior_care
JWT_SECRET=replace_with_a_long_random_secret
```

`client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## Install

```bash
npm install
npm run install:all
```

## Run in Development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

- `GET /api/status`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/health-info`
- `GET /api/reminders`
- `PATCH /api/reminders/:id`
- `GET /api/contacts`
- `POST /api/contacts/call`
- `GET /api/caregiver/profile`
- `PUT /api/caregiver/profile`

## Notes

- The backend seeds default health tips, reminders, and contacts when collections are empty.
- For production deployment, set secure CORS policies and proper authentication as needed.
