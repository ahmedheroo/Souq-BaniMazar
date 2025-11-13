import { Routes } from '@angular/router';
import { Home } from '../components/home/home';
import { Login } from '../components/login/login';
import { Register } from '../components/register/register';

export const routes: Routes = [
    { path: '', component: Home, title: 'الرئيسية' },
    { path: 'home', component: Home, title: 'الرئيسية' },
    { path: 'login', component: Login, title: 'تسجيل الدخول' },
    { path: 'register', component: Register, title: 'إنشاء حساب' },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
