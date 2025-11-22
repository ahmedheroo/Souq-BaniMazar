import { Injectable } from '@angular/core';
import { environment } from '../environment/environment.prod';
import { HttpClient } from '@angular/common/http';
import { status } from '../models/status';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private apiUrl = environment.apiUrl;
  private api = `${this.apiUrl}/Status`;
  constructor(private http: HttpClient) { }
  getStatuses() {
    return this.http.get<status[]>(`${this.api}/GetAllStatuses`);
  }
}
