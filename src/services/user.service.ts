
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    { id: 1, name: 'المشتري الأول', email: 'buyer@example.com', phone: '966551112222+', role: 'buyer' },
    { id: 2, name: 'أحمد علي', email: 'ahmad.ali@example.com', phone: '966501234567+', role: 'seller' },
    { id: 3, name: 'فاطمة محمد', email: 'fatima.m@example.com', phone: '966549876543+', role: 'seller' },
    { id: 4, name: 'مشرف النظام', email: 'admin@example.com', phone: '966500000000+', role: 'admin' },
  ];

  getUsers() {
    return of(this.users);
  }

  getUserById(id: number) {
    const user = this.users.find(u => u.id === id);
    return of(user).pipe(delay(200));
  }
}
