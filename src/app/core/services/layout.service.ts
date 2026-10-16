import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private router = inject(Router);

  // Mobile sidebar open/close state
  sidebarOpen = signal<boolean>(false);

  constructor() {
    // Automatically close sidebar when navigation completes on mobile
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeSidebar();
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  openSidebar(): void {
    this.sidebarOpen.set(true);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
