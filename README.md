# Project_movie_ticket_booking_T11 (Frontend)

Quick start guide to run the React frontend locally after cloning.

Prerequisites
- Node.js 16+ (install from https://nodejs.org)
- npm (bundled with Node) or Yarn

Local setup

1. Clone the repo and install dependencies

```powershell
git clone <your-frontend-repo-url> Project_movie_ticket_booking_T11
cd Project_movie_ticket_booking_T11
npm ci
```

2. Configure backend URL

By default the frontend calls the backend at `http://localhost:8080/api`. If your backend runs elsewhere, edit `src/constants/config.js` and set `BASE_URL` accordingly.

3. Start the development server

```powershell
npm start
# If port 3000 is in use, set a PORT environment variable before starting:
$env:PORT=3000; npm start
```

4. Build for production

```powershell
npm run build
```

Tests

```powershell
npm test
```

Notes
- This project uses Create React App and Material-UI.
- Do not commit secrets. There is no `.env` required by default; backend credentials live in the backend service.
- If the app fails because of CORS when connecting to backend, ensure the backend is running on `localhost:8080` or adjust CORS settings in the backend.

Troubleshooting
- If the app does not compile, run `npm ci` again to reinstall exact deps.
- If APIs return 404/500, check backend logs and ensure you have imported seed data (see backend README).

If you want me to push this frontend to a new GitHub repo for you, tell me the repo URL and I will push it (I will not push secrets).
