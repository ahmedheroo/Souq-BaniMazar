import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { Product } from '../../models/product.model';
import { User } from '../../models/user.model';
import { switchMap, tap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './product-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private userService = inject(UserService);

  product = signal<Product | undefined>(undefined);
  seller = signal<User | undefined>(undefined);
  showPhoneNumber = signal(false);
  
  productData = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.productService.getProductById(id);
      }),
      tap(product => {
        if (product) {
          this.product.set(product);
          this.userService.getUserById(product.sellerId).subscribe(user => {
            this.seller.set(user);
          });
        }
      })
    )
  );

  private allProducts = this.productService.getProducts();

  relatedProducts = computed(() => {
    const currentProduct = this.product();
    if (!currentProduct) {
      return [];
    }

    return this.allProducts()
      .filter(p => p.categoryId === currentProduct.categoryId && p.id !== currentProduct.id)
      .slice(0, 6); // Limit to 6 related products
  });

  togglePhoneNumber() {
    this.showPhoneNumber.update(v => !v);
  }
}