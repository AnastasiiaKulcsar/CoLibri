# CoLibri Angular Frontend

Angular 21 frontend for the CoLibri team workspace. The original static HTML mockups remain at the repository root; the routed Angular application lives in this folder.

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
- `/brainstorming`, `/skillsrollen`, `/ideenabstimmung`, `/ideaausarbeiten`, `/kanban`, `/report` — workspace views

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
