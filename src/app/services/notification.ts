import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  // Solicita permissão ao usuário (obrigatório no Android moderno)
  async requestPermission() {
    await LocalNotifications.requestPermissions();
  }

  // Notificação de Boas-Vindas
  async sendWelcomeNotification(userName: string) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Bem-vindo ao GoldOffers! 🎮',
          body: `Olá, ${userName}! Prepare-se para encontrar os melhores preços.`,
          id: 1,
          schedule: { at: new Date(Date.now() + 1000) }, // Dispara após 1 segundo
          sound: 'default'
        }
      ]
    });
  }

  // Notificação de Alerta de Preço (Para a sua funcionalidade inovadora)
  async sendPriceAlert(gameName: string, price: string) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: '🔥 Alerta de Oferta!',
          body: `O jogo ${gameName} baixou de preço para ${price}! Aproveite agora.`,
          id: 2,
          schedule: { at: new Date(Date.now() + 1000) },
          sound: 'default'
        }
      ]
    });
  }
}