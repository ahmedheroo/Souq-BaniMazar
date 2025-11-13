import { Component, OnInit } from '@angular/core';
import { CategoriesBar } from '../categories-bar/categories-bar';
import { CategoriesWithProductsDto } from '../../interfaces/categories-with-products-dto';
import { CategoriesService } from '../../services/categories-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [CategoriesBar, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  categorieswithproducts: CategoriesWithProductsDto[] = [];
  constructor(private CategoriesService:CategoriesService) {}
  ngOnInit(): void {
    this.CategoriesService.getCategoriesWithProducts()
      .subscribe({
        next: (data) => this.categorieswithproducts = data,
        error: (err) => console.error(err)
      });
  }
}
