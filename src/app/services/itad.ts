import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Platform } from '@ionic/angular/standalone';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ItadService {
  private apiKey = '0b344330a6045942899e19bc73202934c81e397b';
  private baseUrl = 'https://api.isthereanydeal.com';

  // Injeta o HttpClient para o PC e o Platform para detectar onde o app está rodando
  private http = inject(HttpClient);
  private platform = inject(Platform);

  constructor() { }

  buscarJogos(nome: string): Observable<any> {
    const url = `${this.baseUrl}/games/search/v1?key=${this.apiKey}&title=${encodeURIComponent(nome)}`;

    // Se estiver no Celular (Android/iOS), usa o CapacitorHttp (Motor Nativo)
    if (this.platform.is('capacitor')) {
      return from(CapacitorHttp.get({ url })).pipe(
        map((res: HttpResponse) => res.data),
        catchError(() => of([]))
      );
    }
    // Se estiver no PC (Navegador), usa o HttpClient comum (Motor Angular)
    else {
      return this.http.get(url).pipe(catchError(() => of([])));
    }
  }

  getPrecoV3(gameId: string): Observable<any> {
  if (!gameId) return of(null);
  const url = `${this.baseUrl}/games/prices/v3?key=${this.apiKey}&country=BR&nondeals=true`;

  if (this.platform.is('capacitor')) {
    return from(CapacitorHttp.post({
      url,
      data: [String(gameId)],
      headers: { 'Content-Type': 'application/json' }
    })).pipe(
      map((res: HttpResponse) => res.data),
      catchError(() => of([]))
    );
  } else {
    // NO PC: Removemos os Headers para evitar o bloqueio de CORS
    return this.http.post(url, [String(gameId)]).pipe(
      catchError((err) => {
        console.error('Erro HttpClient na ITAD:', err);
        return of([]);
      })
    );
  }
}
}