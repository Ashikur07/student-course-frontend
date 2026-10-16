import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  layoutService = inject(LayoutService);
}