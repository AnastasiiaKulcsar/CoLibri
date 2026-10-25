import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemberDto, ProfileDto, TeamDto } from '../models';
import { TeamApiService } from '../team-api.service';
import { TeamDeadlineService } from '../team-deadline.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-content">
      <div class="page-heading"><div><p class="eyebrow">TEAM &amp; PROFIL</p><h1>Ein starkes Team. Euer Projekt.</h1><p>Verwalte dein Profil und bring die richtigen Menschen zusammen.</p></div></div>
      <div class="profile-grid">
        <section class="card profile-card">
          <h2>Dein Profil</h2>
          <div class="profile-person"><span class="avatar avatar-large">{{ initials(profile.name) }}</span><strong>{{ profile.name }}</strong></div>
          <form class="form-stack" (ngSubmit)="saveProfile()">
            <label>Vollständiger Name<input [(ngModel)]="profile.name" name="name" required /></label>
            <label>E-Mail<input [(ngModel)]="profile.email" name="email" type="email" required /></label>
            <label>Telefonnummer<input [(ngModel)]="profile.phone" name="phone" type="tel" placeholder="+49 ..." /><small>Diese Nummer ist für alle Teammitglieder sichtbar.</small></label>
            <label>Studiengang<input [(ngModel)]="profile.course" name="course" /></label>
            <div class="two-fields"><label>Semester<input [(ngModel)]="profile.semester" name="semester" /></label><label>Hochschule<input [(ngModel)]="profile.university" name="university" /></label></div>
            <label>Über mich<textarea [(ngModel)]="profile.about" name="about" rows="4"></textarea></label>
            <div class="profile-talents">
              <label for="my-talents">Meine Talente (max. 5)</label>
              <div class="member-talent-editor">
                <input id="my-talents" [(ngModel)]="profileTalentDraft" name="profileTalent" maxlength="60" placeholder="Talent eingeben" />
                <button class="small-button" type="button" (click)="addProfileTalent()">+ Hinzufügen</button>
              </div>
              <div class="member-talents" aria-label="Meine Talente">
                <span class="talent-chip" *ngFor="let talent of memberTalents['lena']; let index = index">
                  {{ talent }}
                  <button type="button" [attr.aria-label]="talent + ' aus meinem Profil entfernen'" (click)="removeProfileTalent(index)">×</button>
                </span>
                <small *ngIf="!(memberTalents['lena']?.length)">Noch keine Talente eingetragen.</small>
              </div>
              <p class="feedback" role="status">{{ profileTalentFeedback }}</p>
            </div>
            <button class="primary-button" type="submit">Profil speichern</button>
            <p class="feedback" role="status">{{ profileFeedback }}</p>
          </form>
        </section>

        <div class="team-column">
          <section class="card">
            <div class="team-heading"><div class="team-mark">C</div><div><h2>{{ team.name }}</h2><p>{{ team.projectName }} · Medieninformatik · WiSe 2026</p></div></div>
            <form class="deadline-form" (ngSubmit)="saveDeadline()">
              <label>Team-Abgabedatum<input [(ngModel)]="teamDeadline" name="teamDeadline" type="date" required /></label>
              <button class="small-button" type="submit">Abgabedatum speichern</button>
            </form>
            <p class="feedback" role="status">{{ deadlineFeedback }}</p>
            <div class="section-label">Teammitglieder · {{ team.members.length }}</div>
            <div class="member-list">
              <article class="member-row" *ngFor="let member of team.members">
                <div class="member-person"><span class="avatar" [attr.data-initials]="member.initials">{{ member.initials }}</span><div><strong>{{ member.name }}</strong><small>{{ member.email }}</small><small>{{ member.phone }}</small></div></div>
                <div class="member-actions">
                  <select [(ngModel)]="member.projectRole" [name]="'projectRole-' + member.id" aria-label="Projektrolle">
                    <option>Product Owner</option><option>Developer</option><option>Scrum Master</option>
                  </select>
                  <button class="small-button" type="button" (click)="saveMember(member)">Speichern</button>
                  <button class="small-button danger" type="button" (click)="deleteMember(member)">Löschen</button>
                </div>
                <div class="member-talent-section">
                  <div class="member-talents" [attr.aria-label]="'Talente von ' + member.name">
                    <span class="talent-chip" *ngFor="let talent of memberTalents[member.id]">{{ talent }}</span>
                    <small *ngIf="!(memberTalents[member.id]?.length)">Noch keine Talente eingetragen.</small>
                  </div>
                </div>
              </article>
            </div>
            <p class="feedback" role="status">{{ memberFeedback }}</p>
          </section>

          <section class="card invite-card">
            <h2>Einladung senden</h2><p>Neue Mitglieder erhalten einen Zugangslink.</p>
            <form class="invite-form" (ngSubmit)="invite()">
              <label>Hochschul-E-Mail<input [(ngModel)]="inviteEmail" name="inviteEmail" type="email" placeholder="E-Mail-Adresse eingeben" required /></label>
              <label>Berechtigung<select [(ngModel)]="inviteRole" name="inviteRole"><option>Mitglied</option><option>Admin</option><option>Betrachter</option></select></label>
              <button class="primary-button" type="submit">Einladung senden</button>
              <p class="feedback" role="status">{{ inviteFeedback }}</p>
            </form>
          </section>
        </div>
      </div>
    </section>
  `,
})
export class ProfilePage {
  private readonly api = inject(TeamApiService);
  private readonly deadlineService = inject(TeamDeadlineService);
  protected teamDeadline = this.deadlineService.currentDeadline;
  protected team: TeamDto = { id: '', name: '', projectName: '', members: [] };
  protected profile: ProfileDto = { name: '', email: '', phone: '', course: '', semester: '', university: '', about: '' };
  protected inviteEmail = '';
  protected inviteRole: MemberDto['role'] = 'Mitglied';
  protected profileFeedback = '';
  protected memberFeedback = '';
  protected inviteFeedback = '';
  protected deadlineFeedback = '';
  protected memberTalents: Record<string, string[]> = {};
  protected profileTalentDraft = '';
  protected profileTalentFeedback = '';
  private readonly memberTalentStorageKey = 'colibri-campus-lab-member-talents';
  private readonly demoTalents: Record<string, string[]> = {
    lena: ['UX-Design', 'Prototyping', 'Teamkommunikation'],
    amir: ['Frontend-Entwicklung', 'JavaScript', 'Problemlösung'],
    mia: ['Organisation', 'Moderation', 'Agile Methoden'],
    jonas: ['Recherche', 'Datenanalyse', 'Präsentation'],
  };

  constructor() {
    this.api.getTeam().subscribe((team) => {
      this.team = team;
      this.loadMemberTalents();
    });
    this.api.getProfile().subscribe((profile) => this.profile = profile);
  }

  protected initials(name: string): string {
    return name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  }

  protected saveProfile(): void {
    this.api.saveProfile(this.profile).subscribe((profile) => {
      this.profile = profile;
      this.team.members = this.team.members.map((member) => member.id === 'lena'
        ? { ...member, name: profile.name, email: profile.email, phone: profile.phone, initials: this.initials(profile.name) }
        : member);
      this.profileFeedback = 'Profil im Demo-Modus aktualisiert.';
    });
  }

  protected saveMember(member: MemberDto): void {
    this.api.updateMember(member).subscribe(() => this.memberFeedback = `Änderungen für ${member.name} gespeichert (Demo).`);
  }

  protected saveDeadline(): void {
    try {
      this.deadlineService.saveDeadline(this.teamDeadline);
      this.deadlineFeedback = 'Team-Abgabedatum gespeichert und in der Navigation aktualisiert.';
    } catch (error) {
      this.deadlineFeedback = error instanceof Error ? error.message : 'Team-Abgabedatum konnte nicht gespeichert werden.';
    }
  }

  protected addProfileTalent(): void {
    const talent = this.profileTalentDraft.trim();
    const talents = this.memberTalents['lena'] ?? [];
    if (!talent) {
      this.profileTalentFeedback = 'Bitte gib zuerst ein Talent ein.';
      return;
    }
    if (talents.length >= 5) {
      this.profileTalentFeedback = 'Pro Person sind höchstens fünf Talente möglich.';
      return;
    }
    if (talents.some((item) => item.toLocaleLowerCase() === talent.toLocaleLowerCase())) {
      this.profileTalentFeedback = 'Dieses Talent ist bereits eingetragen.';
      return;
    }

    this.memberTalents = { ...this.memberTalents, lena: [...talents, talent] };
    this.profileTalentDraft = '';
    this.saveMemberTalents();
  }

  protected removeProfileTalent(index: number): void {
    const talents = this.memberTalents['lena'] ?? [];
    this.memberTalents = {
      ...this.memberTalents,
      lena: talents.filter((_, talentIndex) => talentIndex !== index),
    };
    this.saveMemberTalents();
  }

  private loadMemberTalents(): void {
    try {
      const storedTalents = localStorage.getItem(this.memberTalentStorageKey);
      const parsedTalents: unknown = storedTalents ? JSON.parse(storedTalents) : {};
      if (!parsedTalents || typeof parsedTalents !== 'object' || Array.isArray(parsedTalents)) {
        throw new Error('Ungültiges Datenformat für Team-Talente.');
      }

      this.memberTalents = Object.fromEntries(this.team.members.map((member) => {
        const memberTalents = (parsedTalents as Record<string, unknown>)[member.id];
        if (memberTalents === undefined) return [member.id, [...(this.demoTalents[member.id] ?? [])]];
        if (!Array.isArray(memberTalents) || !memberTalents.every((talent) => typeof talent === 'string')) {
          throw new Error(`Ungültige Talentliste für ${member.name}.`);
        }
        const hasSavedTalents = member.id === 'lena' || memberTalents.length > 0;
        return [member.id, hasSavedTalents ? memberTalents.slice(0, 5) : [...(this.demoTalents[member.id] ?? [])]];
      }));
    } catch (error) {
      this.team.members.forEach((member) => this.memberTalents[member.id] = [...(this.demoTalents[member.id] ?? [])]);
      this.memberFeedback = 'Team-Talente konnten nicht geladen werden.';
      console.error('Team-Talente konnten nicht aus dem Browserspeicher geladen werden.', error);
    }
  }

  private saveMemberTalents(): void {
    try {
      localStorage.setItem(this.memberTalentStorageKey, JSON.stringify(this.memberTalents));
      this.profileTalentFeedback = 'Talente gespeichert. Sie sind in diesem Browser verfügbar.';
    } catch (error) {
      this.profileTalentFeedback = 'Talente konnten nicht gespeichert werden.';
      console.error('Team-Talente konnten nicht im Browserspeicher gespeichert werden.', error);
    }
  }

  protected deleteMember(member: MemberDto): void {
    if (!window.confirm(`Möchtest du ${member.name} wirklich aus dem Team löschen?`)) return;
    this.api.deleteMember(member.id).subscribe(() => {
      this.team.members = this.team.members.filter((item) => item.id !== member.id);
      this.memberFeedback = `${member.name} wurde aus dem Team entfernt (Demo).`;
    });
  }

  protected invite(): void {
    this.api.inviteMember(this.inviteEmail, this.inviteRole).subscribe(() => {
      this.inviteFeedback = `Einladung für ${this.inviteEmail} vorbereitet (Demo).`;
      this.inviteEmail = '';
    });
  }
}
