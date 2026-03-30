import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.seuapp.id', // Mantive o seu ID original
  appName: 'Projeto-iv',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    cleartext: true, // Permite tráfego de dados comum (importante para APIs)
    // Isso aqui diz ao Android que o app pode navegar nesses domínios:
    allowNavigation: [
      'api.rawg.io',
      'api.isthereanydeal.com',
      'www.cheapshark.com'
    ]
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;