import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { provideHttpClient } from '@angular/common/http';

// Imports do Firebase (Mantenha estes que já estavam aí)
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeAuth, indexedDBLocalPersistence, provideAuth } from '@angular/fire/auth'; // Adicione estes

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),

    provideFirebaseApp(() => initializeApp({
      projectId: "goldoffers-2514c",
      appId: "1:595841397954:web:e96d11ee72673584f9775b",
      storageBucket: "goldoffers-2514c.firebasestorage.app",
      apiKey: "AIzaSyA64Ysh44h-6YM5EYD1W5PTmOOuDL6fwQw",
      authDomain: "goldoffers-2514c.firebaseapp.com",
      messagingSenderId: "595841397954"
    })),

    // CONFIGURAÇÃO DE PERSISTÊNCIA REFORÇADA:
    provideAuth(() => {
      const auth = initializeAuth(getApp(), {
        persistence: indexedDBLocalPersistence
      });
      return auth;
    }),

    provideFirestore(() => getFirestore()),
  ],
});