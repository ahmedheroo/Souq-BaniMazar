import { Injectable } from '@angular/core';
import { environment } from '..//environment/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriesDto } from '../interfaces/categories-dto';
import { CategoriesWithProductsDto } from '../interfaces/categories-with-products-dto';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = environment.apiUrl;
  private api = `${this.apiUrl}/Categories`;
  
  constructor(private http: HttpClient) { }

  getCategoriesWithProductsCount(): Observable<CategoriesDto[]> {
    return this.http.get<CategoriesDto[]>(
      `${this.api}/GetCategoriesWithProductsCount`
    );
  }

  getCategoriesWithProducts(): Observable<CategoriesWithProductsDto[]> {
    return this.http.get<CategoriesWithProductsDto[]>(
      `${this.api}/GetCategoriesWithProducts`
    );
  }
}
