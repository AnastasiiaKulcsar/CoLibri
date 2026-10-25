import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { TeamDeadlineService } from './team-deadline.service';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  private readonly teamDeadline = inject(TeamDeadlineService);
  protected currentPageTitle = 'Team & Profil';
  protected deadlineLabel = this.teamDeadline.formatDeadline(this.teamDeadline.currentDeadline);
  protected currentDeadline = this.teamDeadline.currentDeadline;
  protected deadlineInputValue = this.currentDeadline;
  protected deadlineMessage = '';
  protected showDeadlineForm = false;
  protected menuMessage = '';
  protected showWorkspaceShell = false;

  constructor() {
    inject(ThemeService);
    this.teamDeadline.deadline$.subscribe((deadline) => {
      this.currentDeadline = deadline;
      this.deadlineLabel = this.teamDeadline.formatDeadline(deadline);
    });
    this.updateRouteState();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateRouteState();
    });
  }

  protected showMenuMessage(section: string): void {
    this.menuMessage = `${section} sind in der Demo vorbereitet.`;
  }

  protected saveDeadline(): void {
    try {
      this.teamDeadline.saveDeadline(this.deadlineInputValue);
      this.deadlineMessage = 'Team-Abgabedatum gespeichert.';
    } catch (error) {
      this.deadlineMessage = error instanceof Error ? error.message : 'Das Abgabedatum konnte nicht gespeichert werden.';
      console.error('Das Team-Abgabedatum konnte nicht gespeichert werden.', error);
    }
  }

  private updateRouteState(): void {
    const route = this.router.routerState.snapshot.root.firstChild;
    const data = route?.data;
    this.currentPageTitle = data?.['title'] ?? 'Team & Profil';
    this.showWorkspaceShell = data?.['workspace'] === true;
  }
}
