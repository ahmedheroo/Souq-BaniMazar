import { Component, computed, effect, inject, signal } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductViewsService } from '../../services/product-views-service';
import { ProductsService } from '../../services/products-service';
import { Auth } from '../../services/auth';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SellerService } from '../../services/seller-service';

@Component({
  selector: 'app-seller-manage-products',
  standalone: true,
  imports: [DecimalPipe, RouterLink,AsyncPipe],
  templateUrl: './seller-mananage-products.html'
})
export class SellerMananageProducts {
  // Inject services
  private productViewsService = inject(ProductViewsService);
  private productsService = inject(ProductsService);
  private authService = inject(Auth);
  private sellerService=inject(SellerService);

  // user signal from Auth service
  currentUser = this.authService.userSignal;

  // sellerId derived from currentUser
  sellerId = computed(() => this.currentUser()?.id ?? null);

  // productViews$ is a computed that returns an Observable<number>.
  // Use in template like: {{ (productViews$() | async) }}
  productViews$ = computed(() => {
    const id = this.sellerId();
    return id
      ? this.productViewsService.getAllProductViewBySellerId(id).pipe(
          catchError((err) => {
            console.error('Failed loading product views', err);
            return of(0);
          })
        )
      : of(0);
  });

  // Products list + pagination signals
  products = signal<any[]>([]);
  productsCount = signal<number>(0);
  pageSize = 10;
  productsCurrentPage = signal<number>(1);

  // computed number of pages
  totalProductPages = computed(() => {
    const count = this.productsCount();
    return Math.max(1, Math.ceil(count / this.pageSize));
  });

  // convenience array for ngFor pagination
  productPages = computed(() => {
    const pages = this.totalProductPages();
    return Array.from({ length: pages }, (_, i) => i + 1);
  });

  constructor() {
    // effect to fetch products whenever sellerId or current page changes
    effect(() => {
      const id = this.sellerId();
      const page = this.productsCurrentPage();

      if (!id) {
        // reset when not logged in
        this.products.set([]);
        this.productsCount.set(0);
        return;
      }

      // call API to load products for seller
      // Ensure your service has a method named getProductsBySellerId(sellerId, page, pageSize)
      this.productsService
        .getProductsBySellerId(id, page, this.pageSize)
        .pipe(
          catchError((err) => {
            console.error('Failed to load products', err);
            return of({ items: [], totalCount: 0 });
          })
        )
        .subscribe((res: any) => {
          this.products.set(res?.items ?? []);
          this.productsCount.set(res?.totalCount ?? (res?.length ?? 0));
        });
    });
  }

  goToProductPage(page: number) {
    const pages = this.totalProductPages();
    if (page < 1) page = 1;
    if (page > pages) page = pages;
    this.productsCurrentPage.set(page);
  }

  viewProduct(productId: any) {
    console.log('view product', productId);
  }

  deleteProduct(productId: any) {
    if (!confirm('هل أنت متأكد من حذف المنتج؟')) return;

    this.productsService.deleteProduct(productId).subscribe({
      next: () => {
        // refresh list after deletion
        this.goToProductPage(1);
      },
      error: (err) => {
        console.error('Failed to delete product', err);
        alert('فشل حذف المنتج');
      }
    });
  }

  productsPaginationInfo() {
    const current = this.productsCurrentPage();
    const total = this.totalProductPages();
    const count = this.productsCount();
    return `عرض ${current} من ${total} — إجمالي المنتجات: ${count}`;
  }

  productsCountSignal() {
    return this.productsCount();
  }
}
