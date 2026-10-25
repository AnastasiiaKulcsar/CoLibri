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
    <main class="team-create-layout">
      <section class="card team-create-card">
        <img class="team-create-photo" src="resources/team-photo.jpg" alt="Ein Team arbeitet gemeinsam an einem Projekt" />
        <a class="auth-brand dark-brand" routerLink="/login"><img src="resources/logo.svg" alt="" />CoLibri</a>
        <p class="eyebrow">DEIN PROJEKT STARTET HIER</p><h1>Erstellt euer Team.</h1><p class="muted">Gib deinem Team einen Namen und füge Mitglieder mit E-Mail-Adresse und Rolle hinzu.</p>
        <form class="form-stack" (ngSubmit)="create()">
          <label>Teamname<input [(ngModel)]="teamName" name="teamName" required maxlength="60" /></label>
          <fieldset><legend>Mitglieder hinzufügen</legend>
            <div class="invite-row" *ngFor="let member of members; let i = index">
              <input [(ngModel)]="member.email" [name]="'email-' + i" type="email" placeholder="E-Mail-Adresse" [required]="members.length > 1" />
              <select [(ngModel)]="member.role" [name]="'role-' + i"><option>Mitglied</option><option>Admin</option><option>Betrachter</option></select>
              <button class="small-button danger" type="button" (click)="remove(i)">Entfernen</button>
            </div>
          </fieldset>
          <button class="text-button" type="button" (click)="add()">＋ Weitere Person hinzufügen</button>
          <p class="error-message" *ngIf="error">{{ error }}</p>
          <button class="primary-button" type="submit">Team erstellen →</button>
        </form>
      </section>
    </main>
  `,
})
export class TeamCreatePage {
  private readonly api = inject(TeamApiService);
  private readonly router = inject(Router);
  protected teamName = 'Campus Lab';
  protected members: Array<{ email: string; role: TeamRole }> = [{ email: 'amir.yilmaz@hs-berlin.de', role: 'Mitglied' }];
  protected error = '';

  protected add(): void { this.members.push({ email: '', role: 'Mitglied' }); }
  protected remove(index: number): void { this.members.splice(index, 1); }

  protected create(): void {
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
    }).subscribe(() => void this.router.navigate(['/profileteam']));
  }
}
