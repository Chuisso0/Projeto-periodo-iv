import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  // Injeção de dependências
  private auth = inject(Auth);
  private router = inject(Router);

  // app.component.ts
  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // Se achou o token no celular, vai direto para o app
        this.router.navigate(['/tabs/tab1']);
      } else {
        // Se não achou, manda para o login (ou welcome)
        this.router.navigate(['/loader']);
      }
    });
  }
}