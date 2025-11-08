
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { CategoryPageComponent } from './components/category-page/category-page.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'الرئيسية' },
  { path: 'product/:id', component: ProductDetailsComponent, title: 'تفاصيل المنتج' },
  { path: 'category/:id', component: CategoryPageComponent, title: 'منتجات القسم' },
  { path: 'register', component: RegisterComponent, title: 'تسجيل بائع جديد' },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard], title: 'الملف الشخصي' },
  { path: 'add-product', component: AddProductComponent, canActivate: [authGuard],  title: 'إضافة منتج' },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard], data: { roles: ['Admin'] }, title: 'لوحة التحكم' },
  { path: 'login', component: LoginComponent, title: 'تسجيل الدخول' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
