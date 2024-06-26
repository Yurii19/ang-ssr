import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PlayerComponent } from './pages/player/player.component';


export const routes: Routes = [
    { path:  'home', component:  HomeComponent},
    { path:  'player', component:  PlayerComponent},
];
