import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonasService } from '../../../../core/services/personas.service';
import { UsuariosService } from '../../../../core/services/usuarios.service';
import { Persona } from '../../../../models/persona.model';
import { Usuario } from '../../../../models/usuario.model';
import { AuthService } from '../../../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss'
})
export class MiPerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  persona: Persona | null = null;
  perfilForm!: FormGroup;
  editMode: boolean = false;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(
    private authService: AuthService,
    private personaService: PersonasService,
    private usuarioService: UsuariosService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioAutenticado();
  }

  obtenerUsuarioAutenticado(): void {
    const usuarioAuth = this.authService.getUser();
    
    if (!usuarioAuth || !usuarioAuth.username) {
      console.error('No hay un usuario autenticado.');
      return;
    }

    this.personaService.getPersonaByCorreo(usuarioAuth.username).subscribe(
      (persona) => {
        this.persona = persona;
        this.cargarFormulario();
      },
      (error) => console.error('Error al obtener la persona:', error)
    );
  }

  cargarFormulario(): void {
    if (!this.persona) return;

    this.perfilForm = this.formBuilder.group({
      nombre: [this.persona.nombre, Validators.required],
      apellido: [this.persona.apellido, Validators.required],
      cedula: [this.persona.cedula, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      correo: [{ value: this.persona.correo, disabled: true }, [Validators.required, Validators.email]], 
      telefono: [this.persona.telefono, Validators.required],
      direccion: [this.persona.direccion, Validators.required],
      fechaNacimiento: [this.persona.fechaNacimiento, Validators.required],
      genero: [this.persona.genero, Validators.required],
    });
    
  }

  activarEdicion(): void {
    this.editMode = true;
  }

  cancelarEdicion(): void {
    this.editMode = false;
    this.cargarFormulario();
  }

  guardarCambios(): void {
    if (this.perfilForm.invalid) {
      this.mensajeError = "Por favor completa todos los campos correctamente.";
      return;
    }

    const datosActualizados: Persona = {
      ...this.persona!,
      ...this.perfilForm.value
    };

    this.personaService.updatePersona(datosActualizados).subscribe(
      () => {
        this.mensajeExito = "Perfil actualizado correctamente.";
        this.mensajeError = null;
        this.editMode = false;
      },
      (error) => {
        console.error('Error al actualizar perfil:', error);
        this.mensajeError = "Error al actualizar el perfil.";
      }
    );
  }
}
