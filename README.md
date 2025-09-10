## Tindora — Tinder for Food

Swipe right and take a bite. Tindora turns your pantry into personalized meals. Upload a grocery receipt to auto-extract ingredients, set your preferences, and swipe through AI-generated recipes. Favorite the ones you love and auto-generate a consolidated grocery list.

[![Demo Video](https://img.youtube.com/vi/yWKjd76fJlQ/0.jpg)](https://www.youtube.com/watch?v=yWKjd76fJlQ&ab_channel=TarunAjjarapu)

Badges: ![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white) ![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange?logo=firebase) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss&logoColor=white) ![Gemini](https://img.shields.io/badge/Google_Gemini-1.5-blue) ![Pexels](https://img.shields.io/badge/Pexels-API-06A77D)

---

### Table of Contents

- Overview
- Awards & Recognition
- Features
- Tech Stack
- Architecture
- Local Development
- Configuration (Environment Variables)
- Routing
- Data Model
- Deployment (Firebase Hosting)
- Security & Privacy
- Roadmap
- Credits & Acknowledgements

---

### Overview

Tindora is a swipe-based meal planning app. It reads your grocery receipt using multimodal AI to extract ingredients and their estimated expiration, then generates meal ideas prioritizing ingredients that are expiring soon. Users can favorite meals and auto-generate a grocery list from those favorites.

- Devpost: https://devpost.com/software/tindora
- Demo video: https://www.youtube.com/watch?v=yWKjd76fJlQ

### Awards & Recognition

- Best Use of MongoDB Atlas (MLH FormulaHacks)
- Best Pitch (MLH FormulaHacks)
- Submitted to the 2024 Gemini API Developer Competition

### Features

- Receipt OCR via Gemini 1.5: Upload an image of a grocery receipt to auto-extract ingredients, purchase date, and estimated expiration dates.
- AI meal generation: Recipe cards generated with calories and cook time estimates, prioritizing ingredients that expire earlier.
- Tinder-style swiping: Accept/reject meals with favorite support.
- Preferences: Save dietary restrictions and preferred cuisines to steer generations.
- Grocery list generation: Consolidate ingredients from favorite meals with quantities and units.
- Firebase Auth: Email/password authentication and session gating for protected routes.
- Firestore storage: User profile, preferences, ingredients, current meals, and favorites.
- Polished UI: Tailwind-styled, mobile-friendly swipe experience with toast notifications.

### Tech Stack

- Frontend: React 18, React Router 6, Tailwind CSS
- Backend-as-a-service: Firebase (Auth, Firestore, Hosting)
- AI: Google Generative AI (Gemini 1.5 Pro/Flash)
- Media: Pexels API for meal imagery
- Tooling: Create React App

### Architecture

High-level flow:

1. Auth: User signs up or logs in with Firebase Auth.
2. Ingredients: User uploads a receipt; Gemini parses ingredients to JSON; ingredients are saved to Firestore under the user.
3. Meal generation: Gemini generates meal cards from Firestore ingredients, honoring preferences and expiration.
4. Swipe actions: Accepting a meal stores it under `currentMeals`; favoriting stores it under `favoriteMeals`.
5. Grocery list: Consolidates ingredients from `favoriteMeals` via AI into a shopping list.

Key components:

- `frontend/src/pages/LandingPage.js`: Receipt upload, ingredients/current meals lists, navigation.
- `frontend/src/pages/MealGeneration.js`: Swipe UI, AI meal generation.
- `frontend/src/pages/Groceries.js`: Grocery list generation and copy-to-clipboard.
- `frontend/src/pages/Profile.js`: Preferences, stats, favorites carousel.
- `frontend/src/pages/MealCard.js`: Meal card UI and actions.

### Local Development

Prereqs: Node.js 18+ and npm.

1. Install dependencies

```
cd frontend
npm install
```

2. Configure environment
   Create `frontend/.env.local` and set the variables from the section below.

3. Start the app

```
npm start
```

Visit http://localhost:3000

### Configuration (Environment Variables)

By default, some API keys are hardcoded in the repo (Gemini, Firebase, Pexels). For security, move all secrets to environment variables and update the code to read from `process.env`.

Recommended `frontend/.env.local`:

```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxx
REACT_APP_FIREBASE_APP_ID=1:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

REACT_APP_GOOGLE_GENAI_API_KEY=your_gemini_api_key
REACT_APP_PEXELS_API_KEY=your_pexels_api_key
```

Then update:

- `frontend/src/firebase/db.js` and `frontend/src/firebase/firebase.js` to use the `REACT_APP_FIREBASE_*` values
- `frontend/src/pages/LandingPage.js` and `frontend/src/pages/MealGeneration.js` to read `REACT_APP_GOOGLE_GENAI_API_KEY`
- `frontend/src/firebase/pexelsAPI.js` to read `REACT_APP_PEXELS_API_KEY`

Note: CRA exposes env vars prefixed with `REACT_APP_` at build time.

### Routing

Defined in `frontend/src/App.js`:

- `/` — Login
- `/register` — Registration
- `/home` — Landing / dashboard
- `/profile` — Profile and preferences
- `/generate-meals` — Swipe UI to accept/reject meals
- `/generate-groceries` — Grocery list from favorites

### Data Model

Firestore (per-user):

- `users/{uid}` document
  - Fields: `uid`, `name`, `email`, `mealsFavorited`, `mealsAccepted`, `mealsRejected`, `ingredientsSaved`, `receiptsUploaded`, `cuisines`, `dietaryRestrictions`
- Subcollections:
  - `ingredients` — docs with `name`, `quantity`, `buyDate`, `expirationDate`
  - `currentMeals` — generated meal cards (name, ingredients, calories, cookTime, earliestExpirationDate, image)
  - `favoriteMeals` — subset of meals favorited by user

### Deployment (Firebase Hosting)

This repo is configured to host the React build from `frontend/build` using `firebase.json`.

1. One-time setup

```
npm i -g firebase-tools
firebase login --no-localhost
```

2. Build the app

```
cd frontend
npm run build
```

3. Deploy

```
cd ..
firebase deploy --only hosting
```

Rewrites route all paths to `index.html` for SPA routing.

### Security & Privacy

- Move all API keys to environment variables before publishing or redeploying.
- Restrict Firebase API key usage to your domain(s) and enable Firestore security rules as appropriate for authenticated access.
- Avoid logging or persisting sensitive user data beyond what is needed.

### Roadmap

- Migrate hardcoded keys to env variables across the app.
- Add auth guards for protected routes (`/home`, `/profile`, generation routes).
- Improve receipt parsing resilience and add manual correction UI.
- Add unit/system tests and CI workflow.
- Add i18n and accessibility enhancements.
- Offline support and caching for meal cards.

### Credits & Acknowledgements

- Built for MLH FormulaHacks — won Best Use of MongoDB Atlas and Best Pitch.
- Demo video: https://www.youtube.com/watch?v=yWKjd76fJlQ

---

If you find Tindora useful, consider starring the repo and sharing your favorite generated meal!
