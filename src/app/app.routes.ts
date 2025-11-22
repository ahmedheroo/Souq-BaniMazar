import { Routes } from '@angular/router';
import { Home } from '../components/home/home';
import { Login } from '../components/login/login';
import { Register } from '../components/register/register';
import { AllCategoriesPage } from '../components/all-categories-page/all-categories-page';
import { AddProduct } from '../components/add-product/add-product';

export const routes: Routes = [
    { path: '', component: Home, title: 'الرئيسية' },
    { path: 'home', component: Home, title: 'الرئيسية' },
    { path: 'login', component: Login, title: 'تسجيل الدخول' },
    { path: 'register', component: Register, title: 'إنشاء حساب' },
    { path: 'categories', component: AllCategoriesPage, title: 'جميع الأقسام' },
    { path: 'addproduct', component: AddProduct, title: 'إضافة منتج' },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
