import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },

  {
    path: 'dashboard-usuario',
    loadChildren: () => import('./dashboard/usuario/usuario-dashboard.routes').then(m => m.dashboardUsuarioRoutes),
    canActivate: [AuthGuard],
    data: { role: 'Usuario' }
  },

  {
    path: 'dashboard-cajero',
    loadChildren: () => import('./dashboard/cajero/cajero-dashboard.routes').then(m => m.dashboardCajeroRoutes),
    canActivate: [AuthGuard],
    data: { role: 'Cajero' }
  },

  { path: '**', redirectTo: '' } 
];
