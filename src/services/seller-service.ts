import { Injectable, inject, computed } from '@angular/core';
import { Auth } from './auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  http = inject(HttpClient);
  sellerId: string = '';
  api = environment.apiUrl;
  apiUrl = `${this.api}/Sellers`;

  getProductsCountBySellerId(sellerId: string) {
    return this.http.get<number>(`${this.apiUrl}/GetProductsCountBySellerId?SellerId=${sellerId}`, {
      withCredentials: true,
    });
  }
}
