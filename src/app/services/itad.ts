import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core'; // Importação do Core original
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ItadService {
  private apiKey = '0b344330a6045942899e19bc73202934c81e397b';
  private baseUrl = 'https://api.isthereanydeal.com';

  constructor() { }

  buscarJogos(nome: string): Observable<any> {
    const options = {
      url: `${this.baseUrl}/games/search/v1?key=${this.apiKey}&title=${encodeURIComponent(nome)}`,
    };

    return from(CapacitorHttp.get(options)).pipe(
      map((res: HttpResponse) => res.data),
      catchError(() => of([]))
    );
  }

  getPrecoV3(gameId: string): Observable<any> {
    if (!gameId) return of(null);

    const options = {
      url: `${this.baseUrl}/games/prices/v3?key=${this.apiKey}&country=BR&nondeals=true`,
      data: [String(gameId)],
      headers: { 'Content-Type': 'application/json' }
    };

    return from(CapacitorHttp.post(options)).pipe(
      map((res: HttpResponse) => res.data),
      catchError((err) => {
        console.error('Erro Nativo na ITAD:', err);
        return of([]);
      })
    );
  }
}