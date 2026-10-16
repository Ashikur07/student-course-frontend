import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../../../core/services/layout.service';

interface NavItem {
  label: string;
  route: string;
  icon: 'dashboard' | 'students' | 'courses' | 'enrollments';
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  layoutService = inject(LayoutService);

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Students', route: '/students', icon: 'students' },
    { label: 'Courses', route: '/courses', icon: 'courses' },
    { label: 'Enrollments', route: '/enrollments', icon: 'enrollments' },
  ];
}