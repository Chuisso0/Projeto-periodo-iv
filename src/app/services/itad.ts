import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';

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
    // Adicionamos a lista de lojas de PC que operam no BR (Nuuvem=33, Steam=61, Epic=103...)
    // Mas o mais seguro é deixar o country=BR agir, ele já filtra naturalmente para PC
    return this.http.post(`${this.baseUrl}/games/prices/v3?key=${this.apiKey}&country=BR`, [gameId]).pipe(
      catchError(() => of(null))
    );
  }
}