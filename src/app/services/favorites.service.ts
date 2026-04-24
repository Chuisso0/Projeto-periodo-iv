import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, deleteDoc, collectionData } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, of, from } from 'rxjs';
import { switchMap, catchError, take, map } from 'rxjs/operators';
import { ItadService } from './itad';

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
}