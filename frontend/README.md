# CoLibri Angular Frontend

Angular 21 frontend for the CoLibri team workspace. The original standalone HTML pages, CSS, and JavaScript remain at the repository root as references for the application's features and interactions. The Angular routes in this folder should preserve the relevant user-visible functionality, but do not need to be pixel-perfect copies.

When changing a screen, compare its Angular route with the corresponding root-level HTML page so forms, actions, navigation, validation, and feedback are not missed. A clean, consistent, responsive layout is sufficient. Work one screen at a time and keep the original static files as references.

## Development

From this folder, run:

```bash
npm install --legacy-peer-deps
npm start
```

Open `http://localhost:4200/`. Build a production bundle with `npm run build`.

## Routes

- `/login` — registration, invitation demo, and team creation flow
- `/team-erstellen` — standalone team creation form
- `/profileteam` — profile, team member roles, invitations, and member management
- `/brainstorming`, `/ideenabstimmung`, `/ideaausarbeiten`, `/report` — workspace views

Kanban is not part of the Angular application. The root-level `kanban.html` remains available as a static design reference.
Skills & Rollen is not part of the Angular application. The root-level `skillsrollen.html` remains available as a static design reference.

The workspace sidebar, header, and account menu are shared across workspace routes.

## Spring Boot API boundary

UI pages use `TeamApiService` and the DTOs in `src/app/models.ts`. Mock mode is enabled in `src/environments/environment.ts`. To call the HTTP implementation, set `useMockData` to `false` and configure `apiBaseUrl` (locally, `http://localhost:8080/api`). Configure Spring Boot CORS to allow the frontend origin.

Expected endpoints:

| Method | Endpoint | Request / response |
| --- | --- | --- |
| `GET` | `/teams/current` | `TeamDto` |
| `POST` | `/teams` | `CreateTeamRequest` → `TeamDto` |
| `GET` | `/profile` | `ProfileDto` |
| `PUT` | `/profile` | `ProfileDto` → `ProfileDto` |
| `PUT` | `/teams/current/members/{memberId}` | `MemberDto` → `MemberDto` |
| `DELETE` | `/teams/current/members/{memberId}` | Empty response |
| `POST` | `/teams/current/invitations` | `{ "email": string, "role": TeamRole }` |

The mock adapter is in-memory; it does not persist changes or send invitations. Authentication, authorization, server-side validation, and database persistence belong in Spring Boot.
