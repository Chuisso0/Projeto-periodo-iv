import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonButton, IonItem, IonInput, IonToolbar } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';

// IMPORT DO FIREBASE
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonButton, IonItem, IonInput, IonToolbar, CommonModule, FormsModule, RouterModule]
})
export class ForgotPasswordPage implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);

  email: string = '';

  constructor() { }

  ngOnInit() { }

  async enviarEmail() {
    if (!this.email) {
      alert('Por favor, digite seu e-mail.');
      return;
    }

    try {
      // O Google cuida de tudo a partir daqui
      await sendPasswordResetEmail(this.auth, this.email);

      alert('E-mail de recuperação enviado! Verifique sua caixa de entrada (e o spam).');

      // Após enviar, voltamos para o login
      this.router.navigate(['/login']);

    } catch (error: any) {
      console.error('Erro:', error.code);
      if (error.code === 'auth/user-not-found') {
        alert('Este e-mail não está cadastrado.');
      } else {
        alert('Erro ao processar solicitação.');
      }
    }
  }
}