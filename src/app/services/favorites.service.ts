import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, doc, setDoc, deleteDoc, collectionData, query } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ItadService } from './itad'; // ajuste o caminho se necessário
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private injector = inject(Injector);
    private itadService = inject(ItadService);
    private firestore = inject(Firestore);
    private auth = inject(Auth);

    constructor() { }

    // Adicionar aos favoritos (Salva o objeto do jogo no Firestore)
    async addFavorite(jogo: any) {
        const user = this.auth.currentUser;
        if (!user) return;

        // NOVIDADE: Buscar o ID da ITAD antes de salvar
        let itadId = null;
        try {
            const buscaItad = await firstValueFrom(this.itadService.buscarJogos(jogo.name || jogo.nome));
            if (buscaItad && buscaItad.length > 0) {
                itadId = buscaItad[0].id; // O ID real que a ITAD entende
            }
        } catch (e) {
            console.error("Não achou ID na ITAD", e);
        }

        const favRef = doc(this.firestore, `usuarios/${user.uid}/favoritos/${jogo.id}`);

        return setDoc(favRef, {
            id: jogo.id,
            itadId: itadId, // AGORA SALVAMOS O ID CERTO!
            nome: jogo.name || jogo.nome,
            thumb: jogo.background_image || jogo.thumb,
            metacritic: jogo.metacritic || null,
            adicionadoEm: new Date()
        });
    }

    // Remover dos favoritos
    async removeFavorite(jogoId: string | number) {
        const user = this.auth.currentUser;
        if (!user) return;

        const favRef = doc(this.firestore, `usuarios/${user.uid}/favoritos/${jogoId}`);
        return deleteDoc(favRef);
    }

    // Listar favoritos do usuário logado em tempo real
    getFavorites(): Observable<any[]> {
        return of(this.auth.currentUser).pipe(
            switchMap(user => {
                if (!user) return of([]);

                // O truque mágico: runInInjectionContext
                // Isso força o Firebase a rodar dentro do "clima" do Angular
                return runInInjectionContext(this.injector, () => {
                    const favCollection = collection(this.firestore, `usuarios/${user.uid}/favoritos`);
                    return collectionData(favCollection);
                });
            })
        );
    }
}