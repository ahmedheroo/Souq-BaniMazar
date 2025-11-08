
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  currentUser = this.authService.currentUser;
  isSeller = () => this.authService.hasRole('seller');
  isAdmin = () => this.authService.hasRole('admin');

  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }
    logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
