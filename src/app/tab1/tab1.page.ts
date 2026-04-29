import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonSpinner, IonBadge, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline, heart, flameOutline, shieldHalfOutline, logoXbox, star } from 'ionicons/icons';
import { GameService } from '../services/game-service';
import { FavoritesService } from '../services/favorites.service';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonSpinner, IonBadge, IonButton, CommonModule]
})
export class Tab1Page implements OnInit, OnDestroy {
  // Listas de jogos
  listaEmAlta: any[] = [];
  listaAguardados: any[] = [];
  listaRPG: any[] = [];
  listaAcao: any[] = [];
  listaFamily: any[] = [];

  carregando: boolean = true;
  jogoBanner: any = null;

  // Injeções
  private gameService = inject(GameService);
  private favService = inject(FavoritesService);
  private auth = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Inscrição para monitorar favoritos em tempo real
  private favSubscription?: Subscription;

  constructor() {
    addIcons({ heartOutline, heart, flameOutline, shieldHalfOutline, logoXbox, star });
  }

  ngOnInit() {
    this.carregarHome();
  }

  ngOnDestroy() {
    // Limpa a inscrição ao destruir o componente
    if (this.favSubscription) {
      this.favSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    // Toda vez que entrar na aba, começamos a "ouvir" os favoritos do Firebase
    this.favSubscription = this.favService.getFavorites().subscribe({
      next: (favoritos) => {
        this.sincronizarStatusFavoritos(favoritos);
      },
      error: (err) => console.error('Erro ao ouvir favoritos:', err)
    });
  }

  ionViewWillLeave() {
    // Para de ouvir ao sair da aba para economizar bateria/processamento
    if (this.favSubscription) {
      this.favSubscription.unsubscribe();
    }
  }

  // Função mestre que marca os corações baseada no que vem do Firebase
  sincronizarStatusFavoritos(favoritos: any[]) {
    const idsFav = favoritos.map(f => String(f.id));

    // Sincroniza o Banner
    if (this.jogoBanner) {
      this.jogoBanner.favorito = idsFav.includes(String(this.jogoBanner.id));
    }

    // Sincroniza todas as listas de uma vez
    const todasAsListas = [
      this.listaEmAlta,
      this.listaAguardados,
      this.listaRPG,
      this.listaAcao,
      this.listaFamily
    ];

    todasAsListas.forEach(lista => {
      lista.forEach(jogo => {
        jogo.favorito = idsFav.includes(String(jogo.id));
      });
    });

    this.cdr.detectChanges();
  }

  toggleFavorito(jogo: any) {
    // Verificação de Login (Ponto 2 do seu pedido)
    if (!this.auth.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    const estadoAnterior = jogo.favorito;
    jogo.favorito = !estadoAnterior;

    if (jogo.favorito) {
      // Adiciona usando o novo padrão Observable
      this.favService.addFavorite({
        id: jogo.id,
        name: jogo.name,
        background_image: jogo.background_image,
        metacritic: jogo.metacritic
      }).subscribe({
        next: () => console.log('Favoritado com sucesso'),
        error: (err) => {
          console.error('Erro ao favoritar:', err);
          jogo.favorito = estadoAnterior; // Reverte se der erro
        }
      });
    } else {
      // Remove usando o novo padrão Observable
      this.favService.removeFavorite(jogo.id).subscribe({
        next: () => console.log('Removido com sucesso'),
        error: (err) => {
          console.error('Erro ao remover:', err);
          jogo.favorito = estadoAnterior;
        }
      });
    }
  }

  carregarHome() {
    this.carregando = true;

    // --- 1. BANNER DE DESTAQUE (QUALIDADE MÁXIMA) ---
    this.gameService.getBannerDestaque().subscribe(res => {
      if (res.results && res.results.length > 0) {
        // Filtramos apenas jogos com imagem
        const jogosValidos = res.results.filter((j: any) => j.background_image !== null);

        // Sorteamos um dos primeiros 5 destaques
        const index = Math.floor(Math.random() * Math.min(jogosValidos.length, 5));

        // AQUI ESTÁ O AJUSTE: Pegamos a imagem original da RAWG (sem replace)
        this.jogoBanner = jogosValidos[index];
      }
    });

    // --- 2. LISTAS (QUALIDADE OTIMIZADA PARA PERFORMANCE) ---

    // Função auxiliar para tratar apenas as imagens das listas menores
    const tratarListaParaPerformance = (lista: any[]) => lista.map(j => {
      if (j.background_image) {
        // Reduzimos para 640px apenas aqui nas listas secundárias
        j.background_image = j.background_image.replace('/media/', '/media/resize/640/-/');
      }
      return j;
    });

    // Encadeamento das listas com o tratamento de performance
    this.gameService.getProximosLancamentos().subscribe(res => {
      this.listaAguardados = tratarListaParaPerformance(res.results);

      this.gameService.getHomeHype().subscribe(res => {
        this.listaEmAlta = tratarListaParaPerformance(res.results);

        this.gameService.getJogosPorGenero('3', 10).subscribe(resAcao => {
          this.listaAcao = tratarListaParaPerformance(resAcao.results);

          this.gameService.getJogosPorGenero('2', 10, '-metacritic').subscribe(resRPG => {
            this.listaRPG = tratarListaParaPerformance(resRPG.results);

            this.gameService.getJogosPorGenero('51', 10).subscribe(resFamily => {
              this.listaFamily = tratarListaParaPerformance(resFamily.results);

              this.carregando = false;
              this.cdr.detectChanges();
            });
          });
        });
      });
    });
  }
}