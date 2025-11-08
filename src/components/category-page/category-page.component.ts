
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { User } from '../../models/user.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-category-page',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './category-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryPageComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private userService = inject(UserService);

  private allProducts = this.productService.getProducts();
  private allCategories = toSignal(this.categoryService.getCategories(), { initialValue: [] as Category[] });
  private allUsers = toSignal(this.userService.getUsers(), { initialValue: [] as User[] });

  // Get current category ID from route
  private categoryId = toSignal(
    this.route.paramMap.pipe(map(params => Number(params.get('id'))))
  );

  currentCategory = computed(() => {
    const id = this.categoryId();
    return this.allCategories().find(c => c.id === id);
  });

  // Filter state signals
  selectedSellerId = signal<number | null>(null);
  searchTerm = signal('');

  sellers = computed(() => this.allUsers().filter(u => u.role === 'seller'));

  // 1. Get products for the current category and combine with details.
  categoryProductsWithDetails = computed(() => {
    const catId = this.categoryId();
    const prods = this.allProducts().filter(p => p.categoryId === catId);
    const usrs = this.allUsers();

    if (!prods.length || !usrs.length) {
      return [];
    }

    return prods.map(product => {
      const seller = usrs.find(u => u.id === product.sellerId);
      return {
        ...product,
        categoryName: this.currentCategory()?.name ?? 'غير مصنف',
        sellerName: seller ? seller.name : 'بائع غير معروف'
      };
    });
  });

  // 2. Apply all filters to the category products.
  filteredProducts = computed(() => {
    const sellerId = this.selectedSellerId();
    const term = this.searchTerm().toLowerCase().trim();
    const allProducts = this.categoryProductsWithDetails();

    return allProducts.filter(p => {
      const sellerMatch = sellerId === null || p.sellerId === sellerId;
      const searchTermMatch = term === '' ||
                              p.name.toLowerCase().includes(term) ||
                              p.description.toLowerCase().includes(term);

      return sellerMatch && searchTermMatch;
    });
  });

  selectSeller(event: Event) {
    const sellerId = (event.target as HTMLSelectElement).value;
    this.selectedSellerId.set(sellerId ? Number(sellerId) : null);
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
  }
}
