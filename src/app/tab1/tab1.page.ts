import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonSpinner, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline, flameOutline, shieldHalfOutline, logoXbox } from 'ionicons/icons'; // Removi skullOutline
import { GameService } from '../services/game-service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonSpinner, IonBadge, CommonModule]
})
export class Tab1Page implements OnInit {
  listaEmAlta: any[] = [];
  listaAguardados: any[] = [];
  listaRPG: any[] = [];
  listaAcao: any[] = []; // Troquei terror por ação
  listaFamily: any[] = [];

  carregando: boolean = true;

  constructor(private gameService: GameService) {
    addIcons({ heartOutline, flameOutline, shieldHalfOutline, logoXbox });
  }

  ngOnInit() {
    this.carregarHome();
  }

  jogoBanner: any = null;

  carregarHome() {
    this.carregando = true;

    this.gameService.getBannerDestaque().subscribe(res => {
      if (res.results && res.results.length > 0) {
        // Filtramos a lista para tirar qualquer jogo que a gente saiba que não lançou 
        // ou que esteja vindo sem imagem/dados completos.
        const jogosValidos = res.results.filter((jogo: any) =>
          jogo.background_image !== null &&
          !jogo.name.includes('The Wolf Among Us 2') // Expulsa o intruso pelo nome
        );

        // Sorteia um dos 3 primeiros que sobraram
        const index = Math.floor(Math.random() * Math.min(jogosValidos.length, 3));
        this.jogoBanner = jogosValidos[index];
      }
    });

    this.gameService.getProximosLancamentos().subscribe(res => {
      this.listaAguardados = res.results;

      // 1. O HYPE REAL (O que a galera está jogando agora)
      this.gameService.getHomeHype().subscribe(res => {
        this.listaEmAlta = res.results;


        // 3. AÇÃO (ID 4 - Garantido)
        this.gameService.getJogosPorGenero('3', 10).subscribe(resAcao => {
          this.listaAcao = resAcao.results;
          this.carregando = false;

          // 2. RPG (ID 5 - Garantido)
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