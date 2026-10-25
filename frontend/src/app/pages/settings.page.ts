import { Component, inject } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  standalone: true,
  template: `
    <section class="page-content settings-view">
      <div class="page-heading">
        <div>
          <p class="eyebrow">DEIN COLIBRI</p>
          <h1>Einstellungen</h1>
          <p>Passe CoLibri an deine Vorlieben an. Das Design wird für die gesamte App gespeichert.</p>
        </div>
      </div>

      <section class="card settings-panel" aria-labelledby="theme-heading">
        <h2 id="theme-heading">Erscheinungsbild</h2>
        <p>Wähle ein helles oder dunkles Design. Deine Auswahl gilt auch auf den anderen CoLibri-Seiten in diesem Browser.</p>
        <fieldset>
          <legend>Design auswählen</legend>
          <label>
            <input type="radio" name="theme" [checked]="themeService.currentTheme === 'light'" (change)="setTheme('light')" />
            <span><strong>Hell</strong><small>Heller Hintergrund</small></span>
          </label>
          <label>
            <input type="radio" name="theme" [checked]="themeService.currentTheme === 'dark'" (change)="setTheme('dark')" />
            <span><strong>Dunkel</strong><small>Augenschonendes dunkles Design</small></span>
          </label>
        </fieldset>
        <p class="feedback" role="status">{{ feedback }}</p>
      </section>

      <section class="card settings-panel" aria-labelledby="help-heading">
        <h2 id="help-heading">Brauchst du Hilfe?</h2>
        <p>Unser Support hilft dir gerne weiter.</p>
        <a href="mailto:supportcolibri@team.net">supportcolibri@team.net</a>
      </section>
    </section>
  `,
})
export class SettingsPage {
  protected readonly themeService = inject(ThemeService);
  protected feedback = '';

  protected setTheme(theme: 'light' | 'dark'): void {
    try {
      this.themeService.setTheme(theme);
      this.feedback = theme === 'dark'
        ? 'Dunkles Design für CoLibri aktiviert.'
        : 'Helles Design für CoLibri aktiviert.';
    } catch {
      this.feedback = 'Die Einstellung konnte nicht gespeichert werden.';
    }
  }
}
