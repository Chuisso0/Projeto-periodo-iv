import { Component, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonIcon, FormsModule],
})
export class Tab1Page {
  private auth = inject(Auth);
  private router = inject(Router);

  userEmail: string = '';
  userPass: string = '';

  async logar() {
    // 1. Bloqueio básico: Não deixa nem tentar se os campos estiverem vazios
    if (!this.userEmail || !this.userPass) {
      alert('Por favor, preencha todos os campos!');
      return; // O 'return' para a função aqui mesmo
    }

    try {
      // 2. A tentativa Real: O código para aqui e espera o Google responder
      const res = await signInWithEmailAndPassword(this.auth, this.userEmail, this.userPass);

      // 3. SE CHEGOU AQUI, DEU CERTO:
      console.log('Usuário autenticado:', res.user.email);

      // Agora sim você libera a entrada do usuário
      this.router.navigate(['/tabs/tab2']);

    } catch (err: any) {
      // 4. SE DEU ERRO (Senha errada, e-mail inexistente, sem internet):
      console.error('Erro ao logar:', err.code);

      // Tratando os erros para o usuário não ficar confuso
      if (err.code === 'auth/invalid-credential') {
        alert('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/invalid-email') {
        alert('O formato do e-mail é inválido.');
      } else {
        alert('Erro ao tentar entrar. Tente novamente mais tarde.');
      }
    }
  }
}