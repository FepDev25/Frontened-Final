import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HorariosService } from '../../../../core/services/horarios.service';
import { Horario } from '../../../../models/horario.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.scss'
})
export class HorariosComponent implements OnInit {
  horarios: Horario[] = [];
  horarioEditando: Horario | null = null;
  horarioForm!: FormGroup;
  localAbierto: boolean = false;

  constructor(
    private horariosService: HorariosService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarHorarios();
  }

  cargarHorarios(): void {
    this.horariosService.getAllHorarios().subscribe({
      next: (horarios) => {
        this.horarios = horarios;
        console.log("Horarios cargados:", this.horarios);
  
        if (this.horarios.length > 0) {
          this.verificarEstadoLocal();  // Ahora sí verificamos si el local está abierto
        } else {
          console.warn("No se encontraron horarios.");
        }
      },
      error: (err) => {
        console.error("Error al cargar los horarios:", err);
      }
    });
  }
  

  verificarEstadoLocal(): void {
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutosActual = ahora.getMinutes();
    const diaSemana = ahora.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  
    console.log(`Hora actual: ${horaActual}:${minutosActual} - Día de la semana: ${diaSemana}`);
  
    if (!this.horarios || this.horarios.length === 0) {
      console.warn("No hay horarios disponibles.");
      this.localAbierto = false;
      return;
    }
  
    let horarioSeleccionado: Horario | undefined;
  
    // Determinar el horario correcto según el día
    for (let horario of this.horarios) {
      if (
        (horario.tipoHorario.descripcion.toLowerCase() === "dias laborales" && diaSemana >= 1 && diaSemana <= 5) || 
        (horario.tipoHorario.descripcion.toLowerCase() === "fin de semana" && (diaSemana === 0 || diaSemana === 6))
      ) {
        horarioSeleccionado = horario;
        break;
      }
    }
  
    if (!horarioSeleccionado) {
      console.warn("No se encontró un horario adecuado para hoy.");
      this.localAbierto = false;
      return;
    }
  
    console.log(`Horario seleccionado: ${horarioSeleccionado.tipoHorario.descripcion} - Apertura: ${horarioSeleccionado.horaApertura} - Cierre: ${horarioSeleccionado.horaCierre}`);
  
    const [horaApertura, minutosApertura] = horarioSeleccionado.horaApertura.split(':').map(Number);
    const [horaCierre, minutosCierre] = horarioSeleccionado.horaCierre.split(':').map(Number);
  
    const apertura = new Date();
    apertura.setHours(horaApertura, minutosApertura, 0, 0);
  
    const cierre = new Date();
    cierre.setHours(horaCierre, minutosCierre, 0, 0);
  
    const actual = new Date();
    actual.setHours(horaActual, minutosActual, 0, 0);
  
    console.log(`Comparación: Actual: ${actual} - Apertura: ${apertura} - Cierre: ${cierre}`);
  
    this.localAbierto = actual >= apertura && actual <= cierre;
  
    console.log("Estado local abierto:", this.localAbierto);
  }
  
  
  

  editarHorario(horario: Horario): void {
    this.horarioEditando = { ...horario };
    this.horarioForm = this.fb.group({
      horaApertura: [horario.horaApertura, Validators.required],
      horaCierre: [horario.horaCierre, Validators.required]
    });
  }

  guardarEdicion(): void {
    if (!this.horarioEditando || !this.horarioForm.valid) return;

    const horarioActualizado: Horario = {
      ...this.horarioEditando,
      horaApertura: this.horarioForm.value.horaApertura,
      horaCierre: this.horarioForm.value.horaCierre
    };

    this.horariosService.updateHorario(horarioActualizado).subscribe({
      next: (updatedHorario) => {
        this.horarios = this.horarios.map(h => h.id === updatedHorario.id ? updatedHorario : h);
        this.horarioEditando = null;
      },
      error: (error) => console.error('Error al actualizar horario:', error)
    });
  }

  cancelarEdicion(): void {
    this.horarioEditando = null;
  }
}
