import { Component, OnInit } from '@angular/core';
import { HorariosService } from '../../../../core/services/horarios.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './inicio-usuario.component.html',
})
export class InicioUsuarioComponent implements OnInit {
  localAbierto: boolean = false;
  excepcionActiva: boolean = false;
  proximaExcepcion: string = '';
  horarioHoy: any = null;
  exceptionHoy: any = null;

  constructor(private horariosService: HorariosService) {}

  ngOnInit(): void {
    this.cargarEstadoParqueadero();
  }

  cargarEstadoParqueadero(): void {
    this.horariosService.getAllHorarios().subscribe({
      next: (horarios) => {
        this.horariosService.getAllExceptionHorarios().subscribe({
          next: (excepciones) => {
            this.verificarEstadoLocal(horarios, excepciones);
          },
          error: (err) => console.error("Error al cargar excepciones:", err),
        });
      },
      error: (err) => console.error("Error al cargar horarios:", err),
    });
  }

  verificarEstadoLocal(horarios: any[], excepciones: any[]): void {
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutosActual = ahora.getMinutes();
    const diaSemana = ahora.getDay();
    const fechaActual = ahora.toISOString().split('T')[0];

    this.exceptionHoy = excepciones.find(exc => exc.fecha === fechaActual) || null;
    this.horarioHoy = horarios.find(horario => 
      (horario.tipoHorario.descripcion.toLowerCase() === "dias laborales" && diaSemana >= 1 && diaSemana <= 5) || 
      (horario.tipoHorario.descripcion.toLowerCase() === "fin de semana" && (diaSemana === 0 || diaSemana === 6))
    );

    if (this.exceptionHoy) {
      if (this.exceptionHoy.cierreTodoDia) {
        this.localAbierto = false;
        this.excepcionActiva = true;
        return;
      }

      const [horaAperturaExc, minutosAperturaExc] = this.exceptionHoy.horaApertura?.split(':').map(Number) || [];
      const [horaCierreExc, minutosCierreExc] = this.exceptionHoy.horaCierre?.split(':').map(Number) || [];

      if (horaAperturaExc !== undefined && horaCierreExc !== undefined) {
        const excepcionAbierta = (horaActual > horaAperturaExc || (horaActual === horaAperturaExc && minutosActual >= minutosAperturaExc)) &&
                                 (horaActual < horaCierreExc || (horaActual === horaCierreExc && minutosActual <= minutosCierreExc));

        if (excepcionAbierta) {
          this.localAbierto = false;
          this.excepcionActiva = true;
          return;
        }

        if (horaActual < horaAperturaExc || (horaActual === horaAperturaExc && minutosActual < minutosAperturaExc)) {
          this.proximaExcepcion = `${this.exceptionHoy.horaApertura} - ${this.exceptionHoy.horaCierre}`;
        }
      }
    }

    if (!this.horarioHoy) {
      this.localAbierto = false;
      return;
    }

    const [horaApertura, minutosApertura] = this.horarioHoy.horaApertura.split(':').map(Number);
    const [horaCierre, minutosCierre] = this.horarioHoy.horaCierre.split(':').map(Number);

    this.localAbierto = (horaActual > horaApertura || (horaActual === horaApertura && minutosActual >= minutosApertura)) &&
                        (horaActual < horaCierre || (horaActual === horaCierre && minutosActual <= minutosCierre));
  }
}
