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
   
      this.auth.refresh().subscribe({
    next: (tokenResult) => {
      if (tokenResult?.accessToken) {
        this.auth.me().subscribe();
      }
    },
    error: () => {
      // no refresh token / invalid, user stays logged out
    }
  });
   if (this.auth.getAccessToken()) {
      this.auth.me().subscribe({
        next: () => { },
        error: () => { }
      });
    }
  }

}
