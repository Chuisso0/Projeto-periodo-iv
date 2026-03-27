import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameService {
  private rawgKey = 'd99274e81bc240279dfad7a04e53b3e2';
  private rawgUrl = 'https://api.rawg.io/api/games';

  constructor(private http: HttpClient) { }

  buscarPorTermo(termo: string): Observable<any> {
    return this.http.get(`https://www.cheapshark.com/api/1.0/games?title=${termo}`);
  }

  // BANNER: Destaques que JÁ LANÇARAM para PC nos últimos 3 meses
  getBannerDestaque(): Observable<any> {
    const hoje = new Date();
    const dataF = hoje.toISOString().split('T')[0];
    const tresMesesAtras = new Date();
    tresMesesAtras.setMonth(hoje.getMonth() - 3);
    const dataI = tresMesesAtras.toISOString().split('T')[0];

    // CORREÇÃO: Adicionado '&platforms=4' corretamente aqui
    const url = `${this.rawgUrl}?key=${this.rawgKey}&dates=${dataI},${dataF}&platforms=4&ordering=-added&page_size=10&exclude_additions=true`;
    return this.http.get(url);
  }

  // DENTRO do game-service.ts
  buscarJogos(termo: string): Observable<any> {
    // search_precise=true: Foca no nome exato
    // ordering=-added: Coloca os mais famosos (os RE reais) no topo
    const url = `${this.rawgUrl}?key=${this.rawgKey}&search=${termo}&platforms=4&search_precise=true&ordering=-added&page_size=30`;
    return this.http.get(url);
  }

  // AGUARDADOS: Futuros lançamentos (GTA VI, Wolverine, etc)
  getProximosLancamentos(): Observable<any> {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataI = amanha.toISOString().split('T')[0];
    const dataF = '2027-12-31';

    // Sem platforms=4 aqui para permitir os "Gigantes" de console que virão para PC depois
    const url = `${this.rawgUrl}?key=${this.rawgKey}&dates=${dataI},${dataF}&ordering=-added&page_size=12&exclude_additions=true`;
    return this.http.get(url);
  }

  // LANÇAMENTOS (BOMBANDO): O que saiu para PC recentemente
  getHomeHype(): Observable<any> {
    const hoje = new Date();
    const dataF = hoje.toISOString().split('T')[0];
    const doisMesesAtras = new Date();
    doisMesesAtras.setMonth(hoje.getMonth() - 2);
    const dataI = doisMesesAtras.toISOString().split('T')[0];

    const url = `${this.rawgUrl}?key=${this.rawgKey}&dates=${dataI},${dataF}&platforms=4&ordering=-added&page_size=12&exclude_additions=true`;
    return this.http.get(url);
  }

  // CATEGORIAS: Filtradas por plataforma PC
  getJogosPorGenero(generoId: string | number, anos: number = 5, ordenarPor: string = '-added'): Observable<any> {
    const hoje = new Date().toISOString().split('T')[0];

    // Usamos a variável 'ordenarPor' na URL
    let url = `${this.rawgUrl}?key=${this.rawgKey}&genres=${generoId}&platforms=4&ordering=${ordenarPor}&page_size=12`;
    if (anos > 0) {
      const dataPassada = new Date();
      dataPassada.setFullYear(new Date().getFullYear() - anos);
      const dataI = dataPassada.toISOString().split('T')[0];
      url += `&dates=${dataI},${hoje}`;
    }

    return this.http.get(url);
  }
}