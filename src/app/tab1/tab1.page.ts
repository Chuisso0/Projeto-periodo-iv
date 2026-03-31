import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonSpinner, IonBadge, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline, heart, flameOutline, shieldHalfOutline, logoXbox, star } from 'ionicons/icons';
import { GameService } from '../services/game-service';
import { FavoritesService } from '../services/favorites.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonSpinner, IonBadge, IonButton, CommonModule]
})
export class Tab1Page implements OnInit {
  listaEmAlta: any[] = [];
  listaAguardados: any[] = [];
  listaRPG: any[] = [];
  listaAcao: any[] = [];
  listaFamily: any[] = [];

  carregando: boolean = true;
  jogoBanner: any = null;

  private gameService = inject(GameService);
  private favService = inject(FavoritesService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    addIcons({ heartOutline, heart, flameOutline, shieldHalfOutline, logoXbox, star });
  }

  ngOnInit() {
    this.carregarHome();
  }

  // Sincroniza os corações toda vez que você entrar na aba Home
  async ionViewWillEnter() {
    await this.atualizarTodosOsStatus();
  }

  // Função para checar o status de favorito em todas as listas da Home
  async atualizarTodosOsStatus() {
    const favoritos = await firstValueFrom(this.favService.getFavorites());
    if (!favoritos) return;

    const idsFav = favoritos.map(f => f.id);

    // Sincroniza o Banner
    if (this.jogoBanner) {
      this.jogoBanner.favorito = idsFav.includes(this.jogoBanner.id);
    }

    // Sincroniza as Listas
    const listas = [this.listaEmAlta, this.listaAguardados, this.listaRPG, this.listaAcao, this.listaFamily];
    listas.forEach(lista => {
      lista.forEach(jogo => {
        jogo.favorito = idsFav.includes(jogo.id);
      });
    });

    this.cdr.detectChanges();
  }

  async toggleFavorito(jogo: any) {
    jogo.favorito = !jogo.favorito;

    try {
      if (jogo.favorito) {
        // Para a Home, passamos o objeto mapeado para o formato que o Favorito espera
        // (ajuste conforme os campos que você usa no card dos favoritos)
        await this.favService.addFavorite({
          id: jogo.id,
          nome: jogo.name,
          thumb: jogo.background_image,
          metacritic: jogo.metacritic
        });
      } else {
        await this.favService.removeFavorite(jogo.id);
      }

      // Após clicar, garantimos que todas as listas reflitam a mudança (caso o jogo apareça em duas listas)
      await this.atualizarTodosOsStatus();
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      jogo.favorito = !jogo.favorito; // Reverte em caso de erro
    }
  }

  carregarHome() {
    this.carregando = true;

    this.gameService.getBannerDestaque().subscribe(res => {
      if (res.results && res.results.length > 0) {
        const jogosValidos = res.results.filter((jogo: any) =>
          jogo.background_image !== null &&
          !jogo.name.includes('The Wolf Among Us 2')
        );

        const index = Math.floor(Math.random() * Math.min(jogosValidos.length, 3));
        this.jogoBanner = jogosValidos[index];
      }
    });

    // Encadeamento de chamadas (usando a lógica original de carregar tudo e depois sincronizar)
    this.gameService.getProximosLancamentos().subscribe(res => {
      this.listaAguardados = res.results;

      this.gameService.getHomeHype().subscribe(res => {
        this.listaEmAlta = res.results;

        this.gameService.getJogosPorGenero('3', 10).subscribe(resAcao => {
          this.listaAcao = resAcao.results;

          this.gameService.getJogosPorGenero('2', 10, '-metacritic').subscribe(resRPG => {
            this.listaRPG = resRPG.results;

            this.gameService.getJogosPorGenero('51', 10).subscribe(async resFamily => {
              this.listaFamily = resFamily.results;

              // AGORA SINCRONIZA TUDO
              await this.atualizarTodosOsStatus();

              this.carregando = false;
              this.cdr.detectChanges();
            });
          });
        });
      });
    });
  }
}