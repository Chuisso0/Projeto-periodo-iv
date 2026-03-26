import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonItem, IonButton, IonList, IonIcon, IonAvatar, IonLabel, IonToolbar } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router'; // <-- Router para navegar

// IMPORTS DO FIREBASE
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonItem, IonButton, IonList, IonIcon, IonAvatar, IonLabel, IonToolbar, CommonModule, FormsModule, RouterModule]
})
export class Tab4Page implements OnInit {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  // Variáveis que vão aparecer no HTML
  nome: string = 'Carregando...';
  email: string = 'Carregando...';

  constructor() { }

  ngOnInit() {
    // onAuthStateChanged "escuta" o Firebase para ter certeza de que o usuário carregou
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        // Já temos o e-mail direto da autenticação
        this.email = user.email || 'Email não encontrado';

        try {
          // Agora vamos no Firestore buscar o nome usando o ID do usuário (uid)
          const docSnap = await getDoc(doc(this.firestore, 'users', user.uid));

          if (docSnap.exists()) {
            // 'login' foi o nome do campo que salvamos lá na página de cadastro, lembra?
            this.nome = docSnap.data()['nome'];
          } else {
            this.nome = 'Visitante';
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          this.nome = 'Erro ao carregar';
        }
      }
    });
  }

  // Função para deslogar do app
  async sair() {
    try {
      await signOut(this.auth);
      // Apaga a "memória" do Firebase e joga pro login
      this.router.navigate(['/login']);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  }
}