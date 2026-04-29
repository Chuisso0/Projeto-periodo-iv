import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, deleteDoc, collectionData } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, of, from } from 'rxjs';
import { switchMap, catchError, take, map } from 'rxjs/operators';
import { ItadService } from './itad';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
    private firestore = inject(Firestore);
    private auth = inject(Auth);
    private itadService = inject(ItadService);

    constructor() { }

    // Retorna a lista de favoritos do usuário logado em tempo real
    getFavorites(): Observable<any[]> {
        return authState(this.auth).pipe(
            switchMap(user => {
                if (!user) return of([]); // Se não estiver logado, retorna lista vazia

                // Caminho no Firebase: usuarios -> {seu_uid} -> favoritos
                const favCollection = collection(this.firestore, `usuarios/${user.uid}/favoritos`);
                return collectionData(favCollection, { idField: 'id' });
            }),
            catchError(() => of([]))
        );
    }

    // Adiciona o jogo direto na subcoleção do usuário no banco de dados
    addFavorite(jogo: any): Observable<void> {
        const user = this.auth.currentUser;
        if (!user) return of(undefined);

        // Aqui definimos o "Caminho das Pedras"
        // usuarios -> UID do Guilherme -> favoritos -> ID do Jogo
        const favRef = doc(this.firestore, `usuarios/${user.uid}/favoritos/${jogo.id}`);

        const dados = {
            id: String(jogo.id),
            nome: jogo.nome || jogo.name,
            thumb: jogo.thumb || jogo.background_image,
            adicionadoEm: new Date().toISOString()
        };

        // O comando 'setDoc' é quem cria as pastas no site do Firebase automaticamente
        return from(setDoc(favRef, dados));
    }

    // Remove o jogo da subcoleção do usuário
    removeFavorite(jogoId: string | number): Observable<void> {
        const user = this.auth.currentUser;
        if (!user) return of(undefined);

        const favRef = doc(this.firestore, `usuarios/${user.uid}/favoritos/${jogoId}`);
        return from(deleteDoc(favRef));
    }

   async exportarParaArquivo(jogos: any[]) {
    const dataAtual = new Date().toLocaleString('pt-BR');
    let corpoTexto = `GOLDOFFERS - RELATÓRIO DE PREÇOS\n`;
    corpoTexto += `Exportado em: ${dataAtual}\n`;
    corpoTexto += `------------------------------------------\n\n`;

    jogos.forEach((jogo, index) => {
      corpoTexto += `${index + 1}. ${jogo.nome.toUpperCase()}\n`;
      
      // Pega o preço que o componente Tab3 preencheu
      const preco = jogo.precoReal || 'Preço não carregado';
      const loja = jogo.loja ? `na ${jogo.loja}` : '';
      
      corpoTexto += `   Valor Atual: ${preco} ${loja}\n`;
      
      if (jogo.temPromocao && jogo.precoAntigo) {
        corpoTexto += `   PROMOÇÃO! (Preço original: ${jogo.precoAntigo})\n`;
      }

      corpoTexto += `   ID: ${jogo.id}\n`;
      corpoTexto += `------------------------------------------\n`;
    });

    try {
      await Filesystem.writeFile({
        path: 'meus-favoritos.txt',
        data: corpoTexto,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      return true;
    } catch (error) {
      return false;
    }
}
}

