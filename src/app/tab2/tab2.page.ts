import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonInput, IonTitle, IonContent, IonIcon, IonItem, IonList, IonThumbnail, IonLabel, IonButton, IonSpinner, IonBadge } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { searchOutline, heartOutline, heart, openOutline } from 'ionicons/icons';
import { GameService } from '../services/game-service';
import { ItadService } from '../services/itad';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonInput, IonIcon, IonTitle, IonItem, IonContent, IonList, IonThumbnail, IonLabel, IonButton, IonSpinner, IonBadge, CommonModule]
})
export class Tab2Page {
  resultados: any[] = [];
  carregando: boolean = false;

  private favService = inject(FavoritesService);
  private gameService = inject(GameService);
  private itadService = inject(ItadService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    addIcons({ searchOutline, heartOutline, heart, openOutline });
  }

  pesquisarJogo(termo: any) {
    if (!termo || termo.trim() === '') {
      this.resultados = [];
      return;
    }

    this.carregando = true;
    this.resultados = [];

    this.gameService.buscarJogos(termo).subscribe({
      next: (res) => {
        const idsVistos = new Set();
        const termoBusca = termo.toLowerCase().trim();

        this.resultados = res.results
          .filter((j: any) => {
            const nomeJogo = j.name.toLowerCase();
            const ehPC = j.platforms?.some((p: any) => p.platform.id === 4);
            const blacklist = ['survivor', 'soundtrack', 'bundle', 'dlc', 'trailer'];
            const estaNaBlacklist = blacklist.some(ruim => nomeJogo.includes(ruim));
            const ehRelevante = j.added >= 5;
            const jaViEsseID = idsVistos.has(j.id);

            if (nomeJogo.includes(termoBusca) && ehPC && !estaNaBlacklist && !jaViEsseID && ehRelevante) {
              idsVistos.add(j.id);
              return true;
            }
            return false;
          })
          .map((j: any) => ({
            id: j.id,
            nome: j.name,
            thumb: j.background_image,
            metacritic: j.metacritic,
            precoReal: 'Carregando...',
            loja: '',
            linkLoja: '',
            favorito: false
          }));

        if (this.resultados.length === 0) {
          this.carregando = false;
          this.cdr.detectChanges();
          return;
        }

        this.resultados.forEach(jogo => {
          this.itadService.buscarJogos(jogo.nome).subscribe(itadRes => {
            if (itadRes && itadRes.length > 0) {

              // --- LÓGICA PARA EVITAR JOGO ERRADO (Ex: RE6 vs Village) ---
              const nomeBuscaLimpo = jogo.nome.toLowerCase().trim();

              // Tenta achar o nome exato primeiro
              let melhorMatch = itadRes.find((res: any) => res.title.toLowerCase().trim() === nomeBuscaLimpo);

              // Se não achou exato, tenta um que contenha o nome (mas que não seja o Village se buscamos o 6)
              if (!melhorMatch) {
                melhorMatch = itadRes.find((res: any) => res.title.toLowerCase().includes(nomeBuscaLimpo));
              }

              // Usa o ID do match encontrado ou o primeiro da lista como último recurso
              const itadId = melhorMatch ? melhorMatch.id : itadRes[0].id;
              jogo.itadId = itadId;

              this.itadService.getPrecoV3(itadId).subscribe({
                next: (res: any[]) => {
                  if (res && res.length > 0) {
                    const gameInfo = res.find(item => item.id === itadId);

                    if (gameInfo && gameInfo.deals && gameInfo.deals.length > 0) {

                      // --- FILTRO ULTRA RIGOROSO (BRL + BLOCK INDIEGALA) ---
                      const ofertasFiltradas = gameInfo.deals.filter((d: any) => {
                        const moedaBRL = d.price?.currency === 'BRL' || d.regular?.currency === 'BRL';
                        const nomeLoja = d.shop.name.toLowerCase();
                        const ehIndieGala = d.shop.id === 43 || nomeLoja.includes('indiegala') || nomeLoja.includes('indie gala');
                        return moedaBRL && !ehIndieGala;
                      });

                      if (ofertasFiltradas.length > 0) {
                        const ordemPrioridade = [50, 61, 18, 35, 74];

                        ofertasFiltradas.sort((a: any, b: any) => {
                          const precoA = a.price?.amount || a.regular?.amount;
                          const precoB = b.price?.amount || b.regular?.amount;
                          if (precoA !== precoB) return precoA - precoB;

                          const pA = ordemPrioridade.indexOf(a.shop.id) === -1 ? 99 : ordemPrioridade.indexOf(a.shop.id);
                          const pB = ordemPrioridade.indexOf(b.shop.id) === -1 ? 99 : ordemPrioridade.indexOf(b.shop.id);
                          return pA - pB;
                        });

                        const melhor = ofertasFiltradas[0];
                        const valorFinal = melhor.price?.amount || melhor.regular?.amount;

                        jogo.precoReal = `R$ ${valorFinal.toFixed(2).replace('.', ',')}`;
                        jogo.loja = melhor.shop.name;
                        jogo.linkLoja = melhor.url;
                      } else {
                        jogo.precoReal = 'Indisponível em R$';
                        jogo.loja = '';
                      }
                    } else {
                      jogo.precoReal = 'Sem ofertas ativas';
                    }
                  } else {
                    jogo.precoReal = 'N/A';
                  }
                  this.cdr.detectChanges();
                }
              });
            } else {
              jogo.precoReal = 'N/A';
              this.cdr.detectChanges();
            }
          });
        });

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  async toggleFavorito(jogo: any) {
    jogo.favorito = !jogo.favorito;
    try {
      if (jogo.favorito) {
        await this.favService.addFavorite(jogo);
      } else {
        await this.favService.removeFavorite(jogo.id);
      }
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      jogo.favorito = !jogo.favorito;
    }
  }

  abrirDetalhes(jogo: any) {
    console.log('Abrindo detalhes de:', jogo.nome);
  }
}