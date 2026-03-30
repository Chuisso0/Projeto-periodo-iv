import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonSpinner, IonBadge, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline, heart, flameOutline, shieldHalfOutline, logoXbox } from 'ionicons/icons';
import { GameService } from '../services/game-service';
import { FavoritesService } from '../services/favorites.service'; // Importe o serviço novo

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

  // Injetando os serviços
  private gameService = inject(GameService);
  private favService = inject(FavoritesService);

  constructor() {
    // Adicionamos o 'heart' (cheio) para quando o jogo for favoritado
    addIcons({ heartOutline, heart, flameOutline, shieldHalfOutline, logoXbox });
  }

  ngOnInit() {
    this.carregarHome();
  }

  // FUNÇÃO PARA FAVORITAR/REMOVER
  async toggleFavorito(jogo: any) {
    // Inverte o estado visual
    jogo.favorito = !jogo.favorito;

    if (jogo.favorito) {
      await this.favService.addFavorite(jogo);
      console.log('Adicionado aos favoritos:', jogo.name);
    } else {
      await this.favService.removeFavorite(jogo.id);
      console.log('Removido dos favoritos:', jogo.id);
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
        // Inicializa o estado de favorito como falso (ou você pode checar no banco depois)
        if (this.jogoBanner) this.jogoBanner.favorito = false;
      }
    });

    this.gameService.getProximosLancamentos().subscribe(res => {
      this.listaAguardados = res.results;

      this.gameService.getHomeHype().subscribe(res => {
        this.listaEmAlta = res.results;

        this.gameService.getJogosPorGenero('3', 10).subscribe(resAcao => {
          this.listaAcao = resAcao.results;

          this.gameService.getJogosPorGenero('2', 10, '-metacritic').subscribe(resRPG => {
            this.listaRPG = resRPG.results;

            this.gameService.getJogosPorGenero('51', 10).subscribe(resFamily => {
              this.listaFamily = resFamily.results;
              this.carregando = false;
            });
          });
        });
      });
    });
  }
}