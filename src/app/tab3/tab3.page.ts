import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonThumbnail, IonLabel, IonButton, IonIcon, IonBadge, IonSpinner, 
  IonButtons, ToastController 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { openOutline, heart, heartDislikeOutline, downloadOutline } from 'ionicons/icons';
import { FavoritesService } from '../services/favorites.service';
import { ItadService } from '../services/itad';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
    IonThumbnail, IonLabel, IonButton, IonIcon, IonBadge, IonSpinner, 
    IonButtons, CommonModule, RouterModule
  ]
})
export class Tab3Page {
  private favService = inject(FavoritesService);
  private itadService = inject(ItadService);
  private cdr = inject(ChangeDetectorRef);
  private toastCtrl = inject(ToastController);

  meusFavoritos$: Observable<any[]>;
  private listaComDadosCompletos: any[] = []; // Onde guardaremos os preços

  constructor() {
    addIcons({ openOutline, heart, heartDislikeOutline, downloadOutline });

    this.meusFavoritos$ = this.favService.getFavorites().pipe(
      tap(jogos => {
        // Toda vez que o Firebase muda, atualizamos nossa lista de referência
        this.listaComDadosCompletos = jogos; 
        
        if (jogos) {
          jogos.forEach(jogo => {
            if (jogo.thumb && jogo.thumb.includes('/media/')) {
              jogo.thumb = jogo.thumb.replace('/media/', '/media/resize/640/-/');
            }
            this.buscarPrecoSeNecessario(jogo);
          });
        }
      })
    );
  }

  async gerarRelatorio() {
    if (this.listaComDadosCompletos.length === 0) {
      const toast = await this.toastCtrl.create({
        message: 'Sua lista está vazia.',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    // Chamamos o serviço passando a lista que já foi "enriquecida" com os preços
    const sucesso = await this.favService.exportarParaArquivo(this.listaComDadosCompletos);

    if (sucesso) {
      alert("Relatório gerado! Verifique a pasta Documentos do celular.");
    } else {
      alert("Erro ao salvar o arquivo.");
    }
  }

  private buscarPrecoSeNecessario(jogo: any) {
    if (jogo.precoReal && 
        jogo.precoReal !== 'Buscando...' && 
        jogo.precoReal !== 'Monitorando preço...') return;

    jogo.precoReal = 'Buscando...';

    this.itadService.buscarJogos(jogo.nome).subscribe({
      next: (itadRes) => {
        if (itadRes && itadRes.length > 0) {
          const itadId = itadRes[0].id;
          this.itadService.getPrecoV3(String(itadId)).subscribe({
            next: (res: any[]) => {
              if (res && res.length > 0) {
                const gameInfo = res.find(item => item.id == itadId);
                if (gameInfo && gameInfo.deals && gameInfo.deals.length > 0) {
                  const melhor = gameInfo.deals[0];
                  
                  // AQUI: Preenchemos os dados no objeto que está na listaComDadosCompletos
                  jogo.precoReal = `R$ ${melhor.price.amount.toFixed(2).replace('.', ',')}`;
                  jogo.loja = melhor.shop.name;
                  jogo.linkLoja = melhor.url;
                  
                  // Se tiver promoção, pegamos o preço antigo também
                  if (melhor.price.amount < melhor.regular.amount) {
                    jogo.temPromocao = true;
                    jogo.precoAntigo = `R$ ${melhor.regular.amount.toFixed(2).replace('.', ',')}`;
                  }
                }
              }
              this.cdr.detectChanges();
            }
          });
        }
      }
    });
  }

  async remover(jogoId: any) {
    try {
      await this.favService.removeFavorite(jogoId);
    } catch (error) {
      console.error('Erro ao remover:', error);
    }
  }
}