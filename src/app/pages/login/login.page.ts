import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonItem, IonInput, AlertController } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';

// 1. IMPORTA O SERVIÇO DE NOTIFICAÇÃO
import { NotificationService } from '../../services/notification';

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
  private auth = inject(Auth);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  // 2. INJETA O SERVIÇO DE NOTIFICAÇÃO
  private notificationService = inject(NotificationService);

  email: string = "";
  password: string = "";

  constructor() { }

  ngOnInit() { }

  async fazerLogin() {
    if (!this.email || !this.password) {
      this.mostrarAlerta('Preencha e-mail e senha!', 'Por favor, insira ambos os campos para continuar.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);

      console.log('Sucesso! Usuário logado:', userCredential.user.email);

      // 3. PEDE PERMISSÃO E ENVIA A NOTIFICAÇÃO DE BOAS-VINDAS
      // Usamos o split para pegar apenas o nome antes do '@' caso o display Name esteja vazio
      const nomeUsuario = userCredential.user.displayName || this.email.split('@')[0];

      await this.notificationService.requestPermission();
      await this.notificationService.sendWelcomeNotification(nomeUsuario);

      this.router.navigate(['/tabs/tab1']);

    } catch (error: any) {
      console.error('Erro ao autenticar:', error.code);
      if (error.code === 'auth/invalid-credential') {
        this.mostrarAlerta('E-mail ou senha incorretos.', 'Verifique suas credenciais e tente novamente.');
      } else {
        this.mostrarAlerta('Ocorreu um erro ao entrar.', 'Verifique sua conexão e tente novamente.');
      }
    }
  }

  async mostrarAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }
}