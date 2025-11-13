import { Component, OnInit ,signal } from '@angular/core';
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
export class App implements OnInit {
constructor(private auth: Auth) {}

  ngOnInit() {
    this.auth.refresh().subscribe(resp => {
      if (resp?.accessToken) {
        this.auth.me().subscribe();
      }
    }, () => { });
  }
}
