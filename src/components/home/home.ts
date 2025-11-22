import { Component, OnInit, signal } from '@angular/core';
import { CategoriesBar } from '../categories-bar/categories-bar';
import { CategoriesWithProductsDto } from '../../interfaces/categories-with-products-dto';
import { CategoriesService } from '../../services/categories-service';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommonModule,DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  // If this is standalone in your app, you can keep standalone: true and imports.
  // Otherwise remove `standalone` and `imports` if you register the component in an NgModule.
  standalone: true,
  imports: [CategoriesBar, RouterLink,CommonModule,DecimalPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  // original data
  categorieswithproducts: CategoriesWithProductsDto[] = [];

  // loading signal used in template via isLoading()
  isLoading = signal<boolean>(false);

  // skeleton configuration (3 category placeholders, 5 products each)
  skeletonCategoryCount = 3;
  skeletonProductCount = 5;
  skeletonCategoryIndexes = Array.from({ length: this.skeletonCategoryCount }, (_, i) => i);
  skeletonProductIndexes = Array.from({ length: this.skeletonProductCount }, (_, i) => i);

  constructor(private CategoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.load();
  }

  private load() {
    this.isLoading.set(true);
    this.CategoriesService.getCategoriesWithProducts()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => this.categorieswithproducts = data,
        error: (err) => {
          console.error(err);
          this.categorieswithproducts = [];
        }
      });
  }
}
