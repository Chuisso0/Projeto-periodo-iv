import { Component, ChangeDetectorRef } from '@angular/core';
import { IonHeader, IonToolbar, IonInput, IonTitle, IonContent, IonIcon, IonItem, IonList, IonThumbnail, IonLabel, IonButton, IonSpinner, IonBadge } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { searchOutline, heartOutline, heart } from 'ionicons/icons';
import { GameService } from '../services/game-service';
import { ItadService } from '../services/itad';

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

  constructor(
    private gameService: GameService,
    private itadService: ItadService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ searchOutline, heartOutline, heart });
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

            // 1. FILTRO DE NOME (O "Pulo do Gato")
            // Verifica se o nome do jogo contém as palavras que você digitou
            // Isso tira jogos como "The Evil Within" se você buscou "Resident Evil"
            const contemNomeReal = nomeJogo.includes(termoBusca);

            // 2. Filtro de Plataforma (PC)
            const ehPC = j.platforms?.some((p: any) => p.platform.id === 4);

            // 3. Filtro de Data
            const anoLancamento = j.released ? new Date(j.released).getFullYear() : 0;
            const ehMuitoAntigo = anoLancamento < 2000;

            // 4. Blacklist (Termos indesejados)
            const blacklist = [
              'survivor', 'climax', 'soundtrack', 'bundle', 'artbook',
              'costume', 'expansion', 'remix', 'beta', 'demo', 'trailer', '(+18)'
            ];
            const estaNaBlacklist = blacklist.some(ruim => nomeJogo.includes(ruim));

            // 5. Evitar Duplicados
            const jaViEsseID = idsVistos.has(j.id);

            // APLICAÇÃO DE TODAS AS REGRAS
            if (contemNomeReal && ehPC && !ehMuitoAntigo && !estaNaBlacklist && !jaViEsseID) {
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
            favorito: false
          }));

        // --- Daqui para baixo segue a sua busca de preços no ITAD igual você já tem ---
        if (this.resultados.length === 0) {
          this.carregando = false;
          this.cdr.detectChanges();
          return;
        }

        this.resultados.forEach(jogo => {
          this.itadService.buscarJogos(jogo.nome).subscribe(itadJogos => {
            if (itadJogos && itadJogos.length > 0) {
              const itadId = itadJogos[0].id;
              this.itadService.getPrecoV3(itadId).subscribe({
                next: (priceData) => {
                  if (priceData && priceData[itadId]) {
                    const deal = priceData[itadId].deals[0];
                    if (deal) {
                      jogo.precoReal = deal.price.amount;
                      jogo.loja = deal.shop.name;
                    } else {
                      jogo.precoReal = 'N/A';
                    }
                  }
                  this.cdr.detectChanges();
                },
                error: () => {
                  jogo.precoReal = 'N/A';
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

  toggleFavorito(jogo: any) {
    jogo.favorito = !jogo.favorito;
    // Lógica para salvar no Storage poderia entrar aqui futuramente
  }

  abrirDetalhes(jogo: any) {
    console.log('Abrindo detalhes de:', jogo.nome);
  }
}