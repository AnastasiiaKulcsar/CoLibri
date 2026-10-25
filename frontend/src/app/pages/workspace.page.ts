import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Idea { title: string; description: string; }
interface Task { title: string; status: string; owner: string; }

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-content">
      <div class="page-heading">
        <div><p class="eyebrow">{{ eyebrow }}</p><h1>{{ heading }}</h1><p>{{ description }}</p></div>
        <button class="primary-button" *ngIf="page === 'brainstorming'" (click)="addIdea()">＋ Idee hinzufügen</button>
        <button class="primary-button" *ngIf="page === 'kanban'" (click)="addTask()">＋ Aufgabe erstellen</button>
        <button class="primary-button" *ngIf="page === 'skills'" (click)="message = 'Rollen im Demo-Modus aktualisiert.'">Rollen speichern</button>
        <button class="primary-button" *ngIf="page === 'report'" (click)="message = 'Bericht für die Demo vorbereitet.'">Bericht exportieren</button>
      </div>
      <div class="tabs">
        <span class="active">{{ heading }}</span><span *ngIf="page === 'brainstorming'">Ideen-Mindmap</span><span *ngIf="page === 'idea'">Empathy Map</span><span *ngIf="page === 'skills'">Rollenverteilung</span>
      </div>
      <p class="feedback" role="status">{{ message }}</p>

      <div class="content-grid" *ngIf="page === 'brainstorming'">
        <article class="card form-stack"><h2>Projektideen-Umfrage</h2><p>Deine Perspektive zählt.</p><label>Was interessiert dich?<textarea [(ngModel)]="interest" rows="3"></textarea></label><label>Welches Problem siehst du am Campus?<textarea rows="3">Viele Fahrräder stehen ungenutzt herum, während anderen ein günstiges Rad fehlt.</textarea></label><button class="secondary-button" (click)="message='Antworten wurden in der Demo aktualisiert.'">Antworten aktualisieren</button></article>
        <article class="card"><h2>Eure Ideen, verbunden.</h2><p class="muted">Ideen für CampusCycle</p><div class="idea-list"><div class="idea-card" *ngFor="let idea of ideas"><strong>{{ idea.title }}</strong><p>{{ idea.description }}</p></div></div></article>
      </div>

      <div class="content-grid" *ngIf="page === 'skills'">
        <article class="card form-stack"><h2>Deine Skills-Umfrage</h2><p>Lena Hoffmann · Selbsteinschätzung</p><label *ngFor="let skill of skills">{{ skill }}<select><option>1</option><option>2</option><option>3</option><option selected>4</option><option>5</option></select></label><label>Was möchtest du lernen?<input value="Frontend-Prototyping & Usability-Tests" /></label></article>
        <article class="card"><h2>Team-Skills-Report</h2><div class="stat-grid"><div class="stat-card"><strong>4</strong><span>Teammitglieder</span></div><div class="stat-card"><strong>12</strong><span>Skills erfasst</span></div><div class="stat-card"><strong>UX</strong><span>Größte Stärke</span></div></div></article>
      </div>

      <div class="content-grid vote-grid" *ngIf="page === 'voting'">
        <article class="card" *ngFor="let idea of ideas"><span class="eyebrow">TEAMIDEE</span><h2>{{ idea.title }}</h2><p>{{ idea.description }}</p><button class="secondary-button" (click)="message='Deine Stimme für ' + idea.title + ' wurde in der Demo erfasst.'">Für diese Idee stimmen</button></article>
      </div>

      <div class="content-grid" *ngIf="page === 'idea'">
        <article class="card form-stack"><h2>Euer Problem Statement</h2><label>Für wen?<input value="Studierende ohne eigenes Fahrrad" /></label><label>Welches Bedürfnis?<input value="Bezahlbar und flexibel mobil sein" /></label><label>Warum ist das wichtig?<textarea rows="4">Hohe Anschaffungskosten erschweren nachhaltige Mobilität im Studienalltag.</textarea></label><button class="primary-button" (click)="message='Änderungen in der Demo gespeichert.'">Änderungen speichern</button></article>
        <article class="card"><h2>Für wen wir gestalten</h2><div class="persona-card"><strong>Alex, 22</strong><p>Studiert im 3. Semester</p><blockquote>„Ich will unkompliziert mobil sein – ohne gleich ein neues Rad kaufen zu müssen.“</blockquote></div></article>
      </div>

      <div class="card" *ngIf="page === 'kanban'">
        <div class="kanban-board"><section class="kanban-column" *ngFor="let status of taskStatuses"><h2>{{ status }} <small>{{ tasksFor(status).length }}</small></h2><article class="task-card" *ngFor="let task of tasksFor(status)"><strong>{{ task.title }}</strong><small>{{ task.owner }}</small><select [(ngModel)]="task.status" aria-label="Aufgabenstatus"><option *ngFor="let option of taskStatuses">{{ option }}</option></select></article></section></div>
      </div>

      <div class="content-grid" *ngIf="page === 'report'">
        <article class="card stat-card"><span>Projektfortschritt</span><strong>63 %</strong><p>+21 Prozentpunkte seit letzter Woche</p></article><article class="card stat-card"><span>Erledigte Aufgaben</span><strong>15</strong><p>von insgesamt 24 Aufgaben</p></article><article class="card stat-card"><span>Teammitglieder</span><strong>4</strong><p>Campus Lab</p></article>
      </div>
    </section>
  `,
})
export class WorkspacePage {
  private readonly route = inject(ActivatedRoute);
  protected page = '';
  protected heading = '';
  protected eyebrow = '';
  protected description = '';
  protected message = '';
  protected interest = 'Nachhaltigkeit, Mobilität, UX';
  protected skills = ['UX / Design', 'Frontend', 'Backend', 'Recherche', 'Organisation'];
  protected ideas: Idea[] = [
    { title: 'CampusCycle', description: 'Fahrräder teilen und Reparaturhilfe auf dem Campus finden.' },
    { title: 'FoodShare', description: 'Übrig gebliebenes Essen teilen und neue Menschen kennenlernen.' },
    { title: 'LernBuddy', description: 'Passende Lernpartner finden und gemeinsam lernen.' },
  ];
  protected taskStatuses = ['Offen', 'In Arbeit', 'Erledigt'];
  protected tasks: Task[] = [
    { title: 'Nutzungsinterviews planen', status: 'Offen', owner: 'Lena' },
    { title: 'Wireframes erstellen', status: 'In Arbeit', owner: 'Amir' },
    { title: 'Team-Feedback sammeln', status: 'Erledigt', owner: 'Mia' },
  ];

  constructor() {
    this.route.data.subscribe((data) => {
      this.page = data['page'] ?? '';
      this.heading = data['title'] ?? '';
      const copy: Record<string, [string, string]> = {
        brainstorming: ['01 / IDEENFINDUNG', 'Sammelt Perspektiven, verbindet Ideen und findet euren gemeinsamen Fokus.'],
        skills: ['02 / TEAMKOMPETENZEN', 'Lernt voneinander und verteilt Verantwortung so, dass alle wachsen können.'],
        voting: ['03 / IDEENABSTIMMUNG', 'Entscheidet gemeinsam, welches Problem ihr lösen möchtet.'],
        idea: ['04 / IDEE AUSARBEITEN', 'Schärft euren Fokus aus der Perspektive eurer Nutzenden.'],
        kanban: ['PROJEKTÜBERSICHT', 'Vom Plan zum Fortschritt – Sprint 2: Der erste nutzbare Prototyp.'],
        report: ['PROJEKTBERICHT', 'Euer Fortschritt auf einen Blick.'],
      };
      [this.eyebrow, this.description] = copy[this.page] ?? ['', ''];
    });
  }

  protected tasksFor(status: string): Task[] { return this.tasks.filter((task) => task.status === status); }
  protected addIdea(): void { this.ideas.unshift({ title: 'Neue Idee', description: 'Beschreibe eure neue Projektidee.' }); this.message = 'Eine neue Idee wurde hinzugefügt.'; }
  protected addTask(): void { this.tasks.push({ title: 'Neue Aufgabe', status: 'Offen', owner: 'Lena' }); this.message = 'Eine neue Aufgabe wurde hinzugefügt.'; }
}
