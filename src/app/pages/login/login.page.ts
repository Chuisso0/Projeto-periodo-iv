import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonItem, IonInput, AlertController } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';

// IMPORTS DO FIREBASE MODULAR
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonButton, IonInput, CommonModule, FormsModule, RouterModule]
})
export class LoginPage implements OnInit {
  // Injetamos o Auth do Firebase e o Router do Angular
  private auth = inject(Auth);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  // Variáveis que recebem os dados do formulário
  email: string = "";
  password: string = "";

  constructor() { }

  ngOnInit() { }

  async fazerLogin() {
    // Validação básica antes de chamar o Google
    if (!this.email || !this.password) {
      this.mostrarAlerta('Preencha e-mail e senha!', 'Por favor, insira ambos os campos para continuar.');
      return;
    }

    try {
      // O comando que realmente faz a API do Google trabalhar:
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);

      console.log('Sucesso! Usuário logado:', userCredential.user.email);

      // SÓ AGORA, se deu tudo certo, ele navega para a Tab1 (Vitrine)
      this.router.navigate(['/tabs/tab1']);

    } catch (error: any) {
      console.error('Erro ao autenticar:', error.code);

      // Tratamento de erros amigável
      if (error.code === 'auth/invalid-credential') {
        this.mostrarAlerta('E-mail ou senha incorretos.', 'Verifique suas credenciais e tente novamente.');
      } else {
        this.mostrarAlerta('Ocorreu um erro ao entrar. Verifique sua conexão.', 'Não foi possível conectar-se ao servidor. Tente novamente mais tarde.');
      }
    }
  }
  async mostrarAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK'],
      cssClass: 'meu-alerta-customizado' // Opcional, se quiser estilizar depois
    });
    await alert.present();
  }
}