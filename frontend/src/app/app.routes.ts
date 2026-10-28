import { Routes } from '@angular/router';
import { LoginPage } from './pages/login.page';
import { ProfilePage } from './pages/profile.page';
import { SettingsPage } from './pages/settings.page';
import { TeamCreatePage } from './pages/team-create.page';
import { WorkspacePage } from './pages/workspace.page';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'team-erstellen', component: TeamCreatePage },
  { path: 'profileteam', component: ProfilePage, data: { workspace: true, title: 'Team & Profil' } },
  { path: 'einstellungen', component: SettingsPage, data: { workspace: true, title: 'Einstellungen' } },
  { path: 'brainstorming', component: WorkspacePage, data: { workspace: true, title: 'Brainstorming', page: 'brainstorming' } },
  { path: 'ideenabstimmung', component: WorkspacePage, data: { workspace: true, title: 'Ideenabstimmung', page: 'voting' } },
  { path: 'ideaausarbeiten', component: WorkspacePage, data: { workspace: true, title: 'Idee ausarbeiten', page: 'idea' } },
  { path: 'report', component: WorkspacePage, data: { workspace: true, title: 'Projektbericht', page: 'report' } },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
