import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "../components/header/header";
import { Footer } from "../components/footer/footer";
import { Auth } from '../services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private auth: Auth) {
   const token = this.auth.getAccessToken();
  if (token) {
    this.auth.me().subscribe({
      next: () => {},
      error: () => {
        // token not valid anymore; user stays logged out
      }
    });
 
  }

}}
