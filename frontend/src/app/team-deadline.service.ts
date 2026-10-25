import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const storageKey = 'colibri-campus-lab-team-deadline';
const defaultDeadline = '2026-10-30';

@Injectable({ providedIn: 'root' })
export class TeamDeadlineService {
  private readonly deadlineSubject = new BehaviorSubject(this.readDeadline());
  readonly deadline$ = this.deadlineSubject.asObservable();

  get currentDeadline(): string {
    return this.deadlineSubject.value;
  }

  saveDeadline(value: string): void {
    if (!this.isValidDate(value)) {
      throw new Error('Bitte gib ein gültiges Abgabedatum ein.');
    }

    localStorage.setItem(storageKey, value);
    this.deadlineSubject.next(value);
  }

  formatDeadline(value: string): string {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'long',
    });
  }

  private readDeadline(): string {
    try {
      const savedDeadline = localStorage.getItem(storageKey);
      if (savedDeadline && this.isValidDate(savedDeadline)) {
        return savedDeadline;
      }
      if (savedDeadline) {
        console.error('Das gespeicherte Team-Abgabedatum ist ungültig.');
      }
    } catch (error) {
      console.error('Das Team-Abgabedatum konnte nicht aus dem Browserspeicher geladen werden.', error);
    }
    return defaultDeadline;
  }

  private isValidDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }
}
