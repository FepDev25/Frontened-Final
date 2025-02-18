import { Component, OnInit } from '@angular/core';
import { Espacio } from '../../../../models/espacio.model';
import { EspaciosService } from '../../../../core/services/espacios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './espacios.component.html',
  styleUrl: './espacios.component.scss'
})
export class EspaciosComponent implements OnInit {
  espacios: Espacio[] = [];
  espaciosPaginados: Espacio[] = [];
  paginaActual: number = 0;
  espaciosPorPagina: number = 25;

  constructor(private espacioService: EspaciosService) {}

  ngOnInit(): void {
    this.cargarEspacios();
  }

  cargarEspacios(): void {
    this.espacioService.getAllEspacios().subscribe({
      next: (espacios) => {
        this.espacios = espacios;
        this.paginarEspacios();
      },
      error: (err) => {
        console.error("Error al cargar los espacios:", err);
      }
    });
  }

  paginarEspacios(): void {
    const inicio = this.paginaActual * this.espaciosPorPagina;
    const fin = inicio + this.espaciosPorPagina;
    this.espaciosPaginados = this.espacios.slice(inicio, fin);
  }

  cambiarPagina(delta: number): void {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 0 && nuevaPagina * this.espaciosPorPagina < this.espacios.length) {
      this.paginaActual = nuevaPagina;
      this.paginarEspacios();
    }
  }

  obtenerClaseEstado(espacio: Espacio): string {
    if (espacio.ocupado) return 'bg-red-500 text-white';
    if (espacio.reservado) return 'bg-orange-500 text-white';
    return 'bg-green-500 text-white';
  }
}
