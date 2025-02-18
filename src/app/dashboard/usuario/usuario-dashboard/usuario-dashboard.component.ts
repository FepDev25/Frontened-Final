import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-usuario-dashboard',
  standalone: true,
  imports: [RouterModule, FooterComponent],
  templateUrl: './usuario-dashboard.component.html',
  styleUrl: './usuario-dashboard.component.scss'
})
export class UsuarioDashboardComponent {
  menuOpen = false; 
  usuario: any = null;
  nombreUsuarioActual: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = this.authService.getUser();
    this.nombreUsuarioActual = this.usuario ? this.usuario.nombre : 'Usuario';
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
} 
