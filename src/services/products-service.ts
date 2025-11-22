import { Injectable } from '@angular/core';
import { environment } from '../environment/environment.prod';
import { HttpClient } from '@angular/common/http';
import { ProductsDto } from '../interfaces/products-dto';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
    private apiUrl = environment.apiUrl;
    private api = `${this.apiUrl}/Products`;
  constructor(private http: HttpClient) { }

    // In auth.service.ts
addProduct(payload: ProductsDto) {
  const formData = new FormData();
  formData.append('Name', payload.name);
  formData.append('Description', payload.description);
  formData.append('Price', payload.price.toFixed() );
  formData.append('CategoryId', payload.categoryId.toString());
  formData.append('ProductImg', payload.productImg);
  formData.append('Quantity', payload.quantity.toString());
  formData.append('SellerId', payload.sellerId);
  formData.append('StatusId', payload.statusId.toString());
 
  return this.http.post(`${this.api}/AddProduct`, formData, {
    withCredentials: true,
  });
}
}
