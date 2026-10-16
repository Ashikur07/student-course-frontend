import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Students', route: '/students', icon: '👨‍🎓' },
    { label: 'Courses', route: '/courses', icon: '📚' },
    { label: 'Enrollments', route: '/enrollments', icon: '📝' },
  ];
}