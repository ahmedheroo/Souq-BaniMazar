import { Routes } from '@angular/router';
import { Home } from '../components/home/home';

export const routes: Routes = [
    {path: '', component:Home, title:'الرئيسية'},
    {path: '**', redirectTo: 'home', pathMatch: 'full'},
];
