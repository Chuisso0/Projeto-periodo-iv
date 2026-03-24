import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Quando o app abrir (caminho vazio ''), ele redireciona para o loader
  {
    path: '',
    redirectTo: 'loader',
    pathMatch: 'full',
  },
  // 2. A rota do seu loader que você já tinha criado
  {
    path: 'loader',
    loadComponent: () => import('./pages/loader/loader.page').then(m => m.LoaderPage)
  },
  // 3. A rota das suas abas (tabs) continua aqui para o app usar depois que o loader terminar
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'tab4',
    loadComponent: () => import('./tab4/tab4.page').then(m => m.Tab4Page)
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then(m => m.CadastroPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
  },
  {
    path: 'nova-senha',
    loadComponent: () => import('./pages/nova-senha/nova-senha.page').then(m => m.NovaSenhaPage)
  },

  {
    path: 'configuracao',
    loadComponent: () => import('./configuracao/configuracao.page').then(m => m.ConfiguracaoPage)
  },
];
