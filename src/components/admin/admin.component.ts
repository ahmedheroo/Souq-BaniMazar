
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { computed } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {
  productService = inject(ProductService);
  userService = inject(UserService);

  products = this.productService.getProducts();
  allUsers = toSignal(this.userService.getUsers(), {initialValue: [] as User[]});

  sellers = computed(() => this.allUsers().filter(u => u.role === 'seller'));

  totalProducts = computed(() => this.products().length);
  totalSellers = computed(() => this.sellers().length);
  totalSalesValue = computed(() => this.products().reduce((sum, product) => sum + product.price, 0));
}