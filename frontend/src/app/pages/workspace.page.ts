import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Idea { title: string; description: string; }

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-content">
      <div class="page-heading">
        <div><p class="eyebrow">{{ eyebrow }}</p><h1>{{ heading }}</h1><p>{{ description }}</p></div>
        <button class="primary-button" *ngIf="page === 'brainstorming'" (click)="addIdea()">＋ Idee hinzufügen</button>
        <button class="primary-button" *ngIf="page === 'report'" (click)="message = 'Bericht für die Demo vorbereitet.'">Bericht exportieren</button>
      </div>
      <div class="tabs">
        <span class="active">{{ heading }}</span><span *ngIf="page === 'brainstorming'">Ideen-Mindmap</span><span *ngIf="page === 'idea'">Empathy Map</span>
      </div>
      <p class="feedback" role="status">{{ message }}</p>

      <div class="content-grid" *ngIf="page === 'brainstorming'">
        <article class="card form-stack"><h2>Projektideen-Umfrage</h2><p>Deine Perspektive zählt.</p><label>Was interessiert dich?<textarea [(ngModel)]="interest" rows="3"></textarea></label><label>Welches Problem siehst du am Campus?<textarea rows="3">Viele Fahrräder stehen ungenutzt herum, während anderen ein günstiges Rad fehlt.</textarea></label><button class="secondary-button" (click)="message='Antworten wurden in der Demo aktualisiert.'">Antworten aktualisieren</button></article>
        <article class="card"><h2>Eure Ideen, verbunden.</h2><p class="muted">Ideen für CampusCycle</p><div class="idea-list"><div class="idea-card" *ngFor="let idea of ideas"><strong>{{ idea.title }}</strong><p>{{ idea.description }}</p></div></div></article>
      </div>

      <div class="content-grid vote-grid" *ngIf="page === 'voting'">
        <article class="card" *ngFor="let idea of ideas"><span class="eyebrow">TEAMIDEE</span><h2>{{ idea.title }}</h2><p>{{ idea.description }}</p><button class="secondary-button" (click)="message='Deine Stimme für ' + idea.title + ' wurde in der Demo erfasst.'">Für diese Idee stimmen</button></article>
      </div>

      <div class="content-grid" *ngIf="page === 'idea'">
        <article class="card form-stack"><h2>Euer Problem Statement</h2><label>Für wen?<input value="Studierende ohne eigenes Fahrrad" /></label><label>Welches Bedürfnis?<input value="Bezahlbar und flexibel mobil sein" /></label><label>Warum ist das wichtig?<textarea rows="4">Hohe Anschaffungskosten erschweren nachhaltige Mobilität im Studienalltag.</textarea></label><button class="primary-button" (click)="message='Änderungen in der Demo gespeichert.'">Änderungen speichern</button></article>
        <article class="card"><h2>Für wen wir gestalten</h2><div class="persona-card"><strong>Alex, 22</strong><p>Studiert im 3. Semester</p><blockquote>„Ich will unkompliziert mobil sein – ohne gleich ein neues Rad kaufen zu müssen.“</blockquote></div></article>
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
  protected ideas: Idea[] = [
    { title: 'CampusCycle', description: 'Fahrräder teilen und Reparaturhilfe auf dem Campus finden.' },
    { title: 'FoodShare', description: 'Übrig gebliebenes Essen teilen und neue Menschen kennenlernen.' },
    { title: 'LernBuddy', description: 'Passende Lernpartner finden und gemeinsam lernen.' },
  ];
  constructor() {
    this.route.data.subscribe((data) => {
      this.page = data['page'] ?? '';
      this.heading = data['title'] ?? '';
      const copy: Record<string, [string, string]> = {
        brainstorming: ['01 / IDEENFINDUNG', 'Sammelt Perspektiven, verbindet Ideen und findet euren gemeinsamen Fokus.'],
        voting: ['03 / IDEENABSTIMMUNG', 'Entscheidet gemeinsam, welches Problem ihr lösen möchtet.'],
        idea: ['04 / IDEE AUSARBEITEN', 'Schärft euren Fokus aus der Perspektive eurer Nutzenden.'],
        report: ['PROJEKTBERICHT', 'Euer Fortschritt auf einen Blick.'],
      };
      [this.eyebrow, this.description] = copy[this.page] ?? ['', ''];
    });
  }

  protected addIdea(): void { this.ideas.unshift({ title: 'Neue Idee', description: 'Beschreibe eure neue Projektidee.' }); this.message = 'Eine neue Idee wurde hinzugefügt.'; }
}
