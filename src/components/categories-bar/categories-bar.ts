import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../services/categories-service';
import { CategoriesDto } from '../../interfaces/categories-dto';
@Component({
  selector: 'app-categories-bar',
  imports: [CommonModule,RouterLink],
  templateUrl: './categories-bar.html',
  styleUrl: './categories-bar.css',
})
export class CategoriesBar implements OnInit {
 categories: CategoriesDto[] = [];
      constructor(private CategoriesService: CategoriesService) {}
        ngOnInit(): void {
    this.CategoriesService.getCategoriesWithProductsCount()
      .subscribe({
        next: (data) => this.categories = data,
        error: (err) => console.error(err)
      });
  }
}
 