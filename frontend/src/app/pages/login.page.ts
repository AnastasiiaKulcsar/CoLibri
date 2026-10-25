import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TeamApiService } from '../team-api.service';
import { TeamRole } from '../models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="auth-layout">
      <aside class="auth-sidebar">
        <a class="auth-brand" routerLink="/login"><img src="resources/logo.svg" alt="" />CoLibri</a>
        <p class="eyebrow">GUTE IDEEN ENTSTEHEN ZUSAMMEN.</p>
        <h1>Aus einer Idee wird euer Projekt.</h1>
        <p class="auth-copy">Findet eure Stärken, plant als Team und macht aus dem nächsten Uni-Projekt etwas Großes.</p>
        <p class="auth-highlight">Kleine Teams, grosse Ideen.</p>
        <img class="team-photo" src="resources/team-photo.jpg" alt="Ein Team arbeitet gemeinsam an einem Projekt" />
        <ul><li>Gemeinsam die richtige Idee finden</li><li>Stärken in klare Rollen übersetzen</li><li>Fortschritt für alle sichtbar machen</li></ul>
        <small class="auth-footer">Für Studierende. Für Teams. Für eure nächste Idee.</small>
      </aside>

      <section class="auth-main">
        <div class="auth-topline">DEIN PROJEKT STARTET HIER</div>
        <ng-container *ngIf="!complete; else completed">
          <div class="auth-title"><h2>{{ invited ? 'Einladung annehmen.' : 'Willkommen im Team.' }}</h2><p>Erstelle dein Konto oder melde dich in deinem Workspace an.</p></div>
          <div class="auth-grid">
            <form class="card form-stack" *ngIf="!showTeamSetup" (ngSubmit)="register()">
              <h2>Konto erstellen</h2><p>Kostenlos starten. Gemeinsam weiterkommen.</p>
              <label>Vor- und Nachname<input [(ngModel)]="name" name="name" required /></label>
              <label>Hochschul-E-Mail<input [(ngModel)]="email" name="email" type="email" required /></label>
              <label>Passwort<input [(ngModel)]="password" name="password" type="password" minlength="8" required /></label>
              <label>Passwort bestätigen<input [(ngModel)]="passwordConfirmation" name="passwordConfirmation" type="password" required /></label>
              <p class="error-message" *ngIf="error">{{ error }}</p>
              <label class="check-label"><input type="checkbox" checked required /> Ich akzeptiere die Nutzungsbedingungen und Datenschutzerklärung.</label>
              <label class="check-label"><input type="checkbox" [(ngModel)]="teamLeader" name="teamLeader" [disabled]="invited" /> Ich möchte ein Team gründen (ein Team pro Konto)</label>
              <button class="primary-button" type="submit">Konto erstellen →</button>
              <small class="muted">Wir senden dir einen Link zur Bestätigung deiner E-Mail.</small>
            </form>

            <form class="card form-stack" *ngIf="showTeamSetup" (ngSubmit)="createTeam()">
              <button class="text-button" type="button" (click)="showTeamSetup = false">← Zurück zur Registrierung</button>
              <h2>Team erstellen</h2><p>Füge Mitglieder mit E-Mail-Adresse und Rolle hinzu.</p>
              <label>Teamname<input [(ngModel)]="teamName" name="teamName" required /></label>
              <div class="invite-row" *ngFor="let member of members; let i = index">
                <input [(ngModel)]="member.email" [name]="'member-' + i" type="email" placeholder="E-Mail-Adresse" aria-label="E-Mail-Adresse des Mitglieds" />
                <select [(ngModel)]="member.role" [name]="'role-' + i" aria-label="Rolle"><option>Mitglied</option><option>Admin</option><option>Betrachter</option></select>
                <button class="small-button danger" type="button" (click)="removeMember(i)">Entfernen</button>
              </div>
              <button class="text-button" type="button" (click)="addMember()">＋ Weitere Person hinzufügen</button>
              <button class="primary-button" type="submit">Team erstellen →</button>
            </form>

            <div class="auth-side-cards" *ngIf="!showTeamSetup">
              <form class="card form-stack" (ngSubmit)="login()"><h2>Schon dabei?</h2><p>Melde dich an und mach weiter.</p><label>Hochschul-E-Mail<input [(ngModel)]="loginEmail" name="loginEmail" type="email" required /></label><label>Passwort<input [(ngModel)]="loginPassword" name="loginPassword" type="password" required /></label><button class="secondary-button" type="submit">Anmelden</button><p class="feedback" role="status">{{ loginFeedback }}</p></form>
              <div class="invite-promo"><span class="mail-icon">✉</span><h3>Du wurdest eingeladen?</h3><p>Registriere dich mit der eingeladenen E-Mail und tritt direkt Team Campus Lab bei.</p><p>Verwende dieselbe E-Mail-Adresse wie in der Einladung. Als eingeladenes Mitglied kannst du kein Team gründen oder Admin auswählen.</p><button class="secondary-button" type="button" (click)="acceptInvitation()">Mit Einladung registrieren</button><p class="feedback">{{ invitationFeedback }}</p><small>Mia freut sich auf dich.</small></div>
            </div>
          </div>
        </ng-container>
        <ng-template #completed><section class="card completion"><h2>{{ invited ? 'Willkommen bei Team Campus Lab!' : 'Konto erstellt' }}</h2><p>{{ invited ? 'Du trittst dem Team als Mitglied bei.' : 'Dein Demo-Konto ist bereit.' }} Es wurden keine Daten gespeichert.</p><button class="primary-button" (click)="goToProfile()">Weiter zu Team &amp; Profil</button></section></ng-template>
      </section>
    </main>
  `,
})
export class LoginPage {
  private readonly router = inject(Router);
  private readonly api = inject(TeamApiService);
  protected name = 'Lena Hoffmann';
  protected email = 'lena.hoffmann@hs-berlin.de';
  protected password = 'demoPass123';
  protected passwordConfirmation = 'demoPass123';
  protected teamLeader = true;
  protected teamName = 'Campus Lab';
  protected members: Array<{ email: string; role: TeamRole }> = [{ email: 'amir.yilmaz@hs-berlin.de', role: 'Mitglied' }];
  protected loginEmail = 'lena.hoffmann@hs-berlin.de';
  protected loginPassword = 'demoPass123';
  protected loginFeedback = '';
  protected invitationFeedback = '';
  protected error = '';
  protected showTeamSetup = false;
  protected invited = false;
  protected complete = false;

  protected register(): void {
    this.error = '';
    if (this.password !== this.passwordConfirmation) {
      this.error = 'Die Passwörter stimmen nicht überein.';
      return;
    }
    if (this.invited) {
      this.complete = true;
      return;
    }
    this.showTeamSetup = this.teamLeader;
    this.complete = !this.teamLeader;
  }

  protected acceptInvitation(): void {
    this.invited = true;
    this.teamLeader = false;
    this.invitationFeedback = 'Einladungsmodus aktiv. Bitte verwende die eingeladene E-Mail-Adresse.';
  }

  protected addMember(): void {
    this.members.push({ email: '', role: 'Mitglied' });
  }

  protected removeMember(index: number): void {
    this.members.splice(index, 1);
  }

  protected createTeam(): void {
    const emails = this.members.map((member) => member.email.trim().toLowerCase()).filter(Boolean);
    if (new Set(emails).size !== emails.length) {
      this.error = 'Jede E-Mail-Adresse darf nur einmal eingetragen werden.';
      return;
    }
    this.api.createTeam({
      name: this.teamName,
      projectName: 'CampusCycle',
      members: this.members.filter((member) => member.email.trim()).map((member) => ({
        email: member.email.trim().toLowerCase(),
        role: member.role,
      })),
    }).subscribe(() => this.complete = true);
  }

  protected login(): void {
    this.loginFeedback = 'Anmeldung in dieser Demo ausgewählt. Es wurden keine Daten gesendet.';
  }

  protected goToProfile(): void {
    void this.router.navigate(['/profileteam']);
  }
}
