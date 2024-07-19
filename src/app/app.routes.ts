import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
//import { PlayerComponent } from './pages/player/player.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: 'home', component: HomeComponent },
  
  {
    path: 'player',
    loadComponent: () =>
      import('./components/player/player.component').then(
        (m) => m.PlayerComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.component').then(
        (m) => m.AdminComponent
      ),
  },
];
