import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private userService = inject(UserService);

  products = this.productService.getProducts();
  categories = toSignal(this.categoryService.getCategories(), { initialValue: [] as Category[] });
  users = toSignal(this.userService.getUsers(), { initialValue: [] as User[] });

  isLoading = computed(() => this.products().length === 0);

  // Group products by category and include seller info
  productsByCategory = computed(() => {
    const prods = this.products();
    const cats = this.categories();
    const usrs = this.users();

    if (!prods.length || !cats.length || !usrs.length) {
      return [];
    }
    
    return cats.map(category => {
      const categoryProducts = prods
        .filter(p => p.categoryId === category.id)
        .map(product => {
            const seller = usrs.find(u => u.id === product.sellerId);
            return {
                ...product,
                sellerName: seller ? seller.name : 'بائع غير معروف'
            };
        });

      return {
        ...category,
        products: categoryProducts.slice(0, 4) // Show first 3 products
      };
    }).filter(categoryGroup => categoryGroup.products.length > 0); // Only show categories that have products
  });
}
