import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, timeout } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ItadService {
  private apiKey = '0b344330a6045942899e19bc73202934c81e397b';
  private baseUrl = 'https://api.isthereanydeal.com';

  constructor(private http: HttpClient) { }

  // 1. Busca a lista de jogos pelo nome (Endpoint estável)
  buscarJogos(nome: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/games/search/v1?key=${this.apiKey}&title=${nome}`).pipe(
      catchError(() => of([]))
    );
  }

  // 2. Busca o preço pelo ID (V3 - Preço do Brasil)
  getPrecoV3(gameId: string): Observable<any> {
    if (!gameId) return of(null);

    // Removi os headers manuais. 
    // No PC, o navegador briga com o 'Content-Type' customizado em chamadas POST simples.
    return this.http.post(
      `${this.baseUrl}/games/prices/v3?key=${this.apiKey}&country=BR&nondeals=true`,
      [gameId] // Passa o array direto, o Angular se vira
    ).pipe(
      timeout(5000),
      catchError((err) => {
        console.error('Erro na ITAD:', err);
        return of(null);
      })
    );
  }
}