import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { provideHttpClient } from '@angular/common/http';

// Imports do Firebase (Mantenha estes que já estavam aí)
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideHttpClient(), // <-- Adicione esta linha para habilitar o HttpClient em todo o app
    // Configuração que o terminal gerou para você:
    provideFirebaseApp(() => initializeApp({
      projectId: "goldoffers-2514c",
      appId: "1:595841397954:web:e96d11ee72673584f9775b",
      storageBucket: "goldoffers-2514c.firebasestorage.app",
      apiKey: "AIzaSyA64Ysh44h-6YM5EYD1W5PTmOOuDL6fwQw",
      authDomain: "goldoffers-2514c.firebaseapp.com",
      messagingSenderId: "595841397954"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
});