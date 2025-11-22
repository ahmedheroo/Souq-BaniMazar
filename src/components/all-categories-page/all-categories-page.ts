import { Component, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../services/categories-service';
import { CategoriesDto } from '../../interfaces/categories-dto';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-all-categories-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './all-categories-page.html',
  styleUrl: './all-categories-page.css',
})
export class AllCategoriesPage implements OnInit {
  constructor(private CategoriesService: CategoriesService) { }

  categories = signal<CategoriesDto[]>([]);
  isLoading = signal<boolean>(false);
    skeletonCount = 10;
  skeletons = Array.from({ length: this.skeletonCount }, (_, i) => i);

  ngOnInit(): void {
    this.loadCategories();
  }
  private loadCategories() {
    this.isLoading.set(true);
    this.CategoriesService.getCategoriesWithProductsCount()
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (data) => this.categories.set(data),
        error: (err) => {
          console.error(err);
          // optionally set categories([]) or show a toast
          this.categories.set([]);
        }
      });
  }
}
