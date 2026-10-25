import { Injectable } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'colibri-theme';
  private activeTheme: Theme = 'light';

  constructor() {
    try {
      const savedTheme = localStorage.getItem(this.storageKey);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.activeTheme = savedTheme;
      } else if (savedTheme) {
        console.error('Die gespeicherte CoLibri-Theme-Einstellung ist ungültig.');
      }
    } catch (error) {
      console.error('Die CoLibri-Theme-Einstellung konnte nicht geladen werden.', error);
    }
    this.applyTheme();
  }

  get currentTheme(): Theme {
    return this.activeTheme;
  }

  setTheme(theme: Theme): void {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (error) {
      console.error('Die Theme-Einstellung konnte nicht gespeichert werden.', error);
      throw error;
    }

    this.activeTheme = theme;
    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.dataset['theme'] = this.activeTheme;
  }
}
