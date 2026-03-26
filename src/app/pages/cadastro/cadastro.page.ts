import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonItem } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';



@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonItem, CommonModule, FormsModule, RouterModule]
})
export class CadastroPage implements OnInit {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  // Variáveis para o formulário
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  nomeUsuario: string = '';

  constructor() { }

  ngOnInit() { }

  async cadastrar() {
    // Validações de segurança antes de enviar
    if (!this.email || !this.password || !this.confirmPassword || !this.nomeUsuario) {
      alert('Preencha todos os campos!');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (this.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      // Chama a API do Google para criar o usuário
      const res = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const uid = res.user.uid;
      console.log('Usuário criado:', res.user);

      // Salvar informações adicionais no Firestore
      await setDoc(doc(this.firestore, 'users', uid), {
        nome: this.nomeUsuario,
        email: this.email
      });

      console.log('Usuário e perfil criados!');
      alert('Cadastro realizado com sucesso!');

      // Só agora mandamos ele para o login ou direto para a Home
      this.router.navigate(['/login']);

    } catch (error: any) {
      console.error('Erro no cadastro:', error.code);

      if (error.code === 'auth/email-already-in-use') {
        alert('Este e-mail já está em uso.');
      } else if (error.code === 'auth/invalid-email') {
        alert('E-mail inválido.');
      } else {
        alert('Erro ao cadastrar. Tente novamente.');
      }
    }
  }
}