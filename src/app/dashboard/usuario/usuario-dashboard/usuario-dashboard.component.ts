import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-dashboard',
  standalone: true,
  imports: [RouterModule, FooterComponent,CommonModule],
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
    this.verificarTamañoPantalla();

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  @HostListener('window:resize', [])
  verificarTamañoPantalla(): void {
    if (window.innerWidth >= 768) {
      this.menuOpen = false;
    }
  }
  closeMenu() {
    this.menuOpen = false;
  }
} 
