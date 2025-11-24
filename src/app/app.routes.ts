import { Routes } from '@angular/router';
import { Home } from '../components/home/home';
import { Login } from '../components/login/login';
import { Register } from '../components/register/register';
import { AllCategoriesPage } from '../components/all-categories-page/all-categories-page';
import { AddProduct } from '../components/add-product/add-product';
import { SellerMananageProducts } from '../components/seller-mananage-products/seller-mananage-products';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
    { path: '', component: Home, title: 'الرئيسية' },
    { path: 'home', component: Home, title: 'الرئيسية' },
    { path: 'login', component: Login, title: 'تسجيل الدخول' },
    { path: 'register', component: Register, title: 'إنشاء حساب' },
    { path: 'categories', component: AllCategoriesPage, title: 'جميع الأقسام' },
    { path: 'seller/addproduct', component: AddProduct, title: 'إضافة منتج', canActivate: [AuthGuard] },
    {
        path: 'seller/manage-products',
        loadComponent: () =>
            import('../components/seller-mananage-products/seller-mananage-products')
                .then(c => c.SellerMananageProducts),
        canActivate: [AuthGuard]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
