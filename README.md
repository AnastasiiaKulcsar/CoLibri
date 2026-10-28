# CoLibri Frontend

## Which frontend to use

The maintained application is the Angular frontend in [`frontend/`](frontend/). Run and make application changes there. The standalone HTML pages and their JavaScript at the repository root are references for the existing features and interactions; keep them as references, not as a second application to maintain.

## Preserving functionality

The Angular pages should preserve the relevant user-visible functionality of the standalone HTML pages: forms, actions, navigation, validation, and feedback. Pixel-perfect styling is not required. Use a clean, consistent, responsive design and compare each Angular route with its HTML reference to ensure important features and interactions are not missed. Implement and verify one screen at a time.

## Development

From the `frontend` directory:

```bash
npm install --legacy-peer-deps
npm start
```

Open `http://localhost:4200/`. To check that the Angular app builds, run:

```bash
npm run build
```

## Backend integration later

The current frontend uses mock data. Spring Boot and MariaDB integration will be added later; backend work is not required to prepare or run the frontend. The Angular app already has a `TeamApiService` boundary and DTOs to connect to the backend when it is ready. See [`frontend/README.md`](frontend/README.md) for the expected API endpoints and configuration.
