import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonThumbnail, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { FavoritesService } from '../services/favorites.service';
import { ItadService } from '../services/itad';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { openOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonThumbnail, IonLabel, IonButton, IonIcon, CommonModule]
})
export class Tab3Page {
  private favService = inject(FavoritesService);
  private itadService = inject(ItadService);
  private cdr = inject(ChangeDetectorRef);

  meusFavoritos$: Observable<any[]>;

  constructor() {
    addIcons({ openOutline, trashOutline });

    this.meusFavoritos$ = this.favService.getFavorites().pipe(
      tap(jogos => {
        if (jogos) {
          jogos.forEach(jogo => this.buscarPrecoSeNecessario(jogo));
        }
      })
    );
  }

  private buscarPrecoSeNecessario(jogo: any) {
    if (jogo.precoReal &&
      jogo.precoReal !== 'Buscando...' &&
      jogo.precoReal !== 'Monitorando preço...') return;

    jogo.precoReal = 'Buscando...';

    this.itadService.buscarJogos(jogo.nome).subscribe({
      next: (itadRes) => {
        if (itadRes && itadRes.length > 0) {
          const nomeBuscaLimpo = jogo.nome.toLowerCase().trim();
          let melhorMatch = itadRes.find((res: any) => res.title.toLowerCase().trim() === nomeBuscaLimpo);

          if (!melhorMatch) {
            melhorMatch = itadRes.find((res: any) => res.title.toLowerCase().includes(nomeBuscaLimpo));
          }

          const itadId = melhorMatch ? melhorMatch.id : itadRes[0].id;
          jogo.itadId = itadId;

          this.itadService.getPrecoV3(itadId).subscribe({
            next: (res: any[]) => {
              if (res && res.length > 0) {
                const gameInfo = res.find(item => item.id === itadId);

                if (gameInfo && gameInfo.deals) {
                  const ofertasFiltradas = gameInfo.deals.filter((d: any) => {
                    const moedaBRL = d.price?.currency === 'BRL' || d.regular?.currency === 'BRL';
                    const nomeLoja = d.shop.name.toLowerCase();
                    const ehIndieGala = d.shop.id === 43 || nomeLoja.includes('indiegala') || nomeLoja.includes('indie gala');
                    return moedaBRL && !ehIndieGala;
                  });

                  if (ofertasFiltradas.length > 0) {
                    const ordemPrioridade = [50, 61, 18, 35, 74];
                    ofertasFiltradas.sort((a: any) => { /* ... mesma ordenação ... */ }); // (Mantenha sua ordenação atual aqui)

                    const melhor = ofertasFiltradas[0];
                    const precoAtual = melhor.price?.amount || 0;
                    const precoOriginal = melhor.regular?.amount || 0;

                    // --- NOVA LÓGICA DE PROMOÇÃO ---
                    if (precoAtual < precoOriginal) {
                      jogo.temPromocao = true;
                      jogo.precoAntigo = `R$ ${precoOriginal.toFixed(2).replace('.', ',')}`;
                    } else {
                      jogo.temPromocao = false;
                    }

                    jogo.precoReal = `R$ ${precoAtual.toFixed(2).replace('.', ',')}`;
                    jogo.loja = melhor.shop.name;
                    jogo.linkLoja = melhor.url;
                  } else {
                    jogo.precoReal = 'Indisponível em R$';
                  }
                }
              } else {
                jogo.precoReal = 'N/A';
              }
              this.cdr.detectChanges();
            },
            error: () => {
              jogo.precoReal = 'Erro API';
              this.cdr.detectChanges();
            }
          });
        } else {
          jogo.precoReal = 'N/A';
          this.cdr.detectChanges();
        }
      }
    });
  }

  remover(jogoId: any) {
    this.favService.removeFavorite(jogoId);
  }
}