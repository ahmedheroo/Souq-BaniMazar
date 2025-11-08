
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: Category[] = [
    { id: 1, name: 'إلكترونيات' },
    { id: 2, name: 'أثاث منزلي' },
    { id: 3, name: 'سيارات' },
    { id: 4, name: 'ملابس' },
    { id: 5, name: 'عقارات' }
  ];

  getCategories() {
    return of(this.categories);
  }
}
