import { Injectable } from '@angular/core';
import { environment } from '../environment/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductViews } from '../models/ProductViews';

@Injectable({
  providedIn: 'root',
})
export class ProductViewsService {
  api=environment.apiUrl;
  apiUrl=`${this.api}/ProductViews`;

  constructor(private http:HttpClient) {}

  getAllProductViewBySellerId(sellerId:string):Observable<any>{
    return this.http.get<number>(`${this.apiUrl}/GetAllProductViewBySellerId?SellerId=${sellerId}`);
  }
}
