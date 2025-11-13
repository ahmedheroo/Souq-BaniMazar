import { Component, signal, inject } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  isMenuOpen = signal(false);
  authService = inject(Auth);
  private router = inject(Router);

  // observable user from Auth service
  user$ = this.authService.currentUser$;

  // role helpers (adjust role names if your backend uses different casing)
  isSeller = () => this.authService.hasRole('Seller');
  isAdmin = () => this.authService.hasRole('Admin');

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }
  
  logout() {
    // subscribe to ensure logout request is sent and local state is cleared before navigation
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/'])
    });
  }
}
