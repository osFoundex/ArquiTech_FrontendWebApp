import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from './config.service';
import { Router } from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core'; // ✅ Importación agregada

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    ReactiveFormsModule,
    TranslatePipe
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  mensajeConfirmacion: string = '';

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private router: Router // ✅ Inyección de Router
  ) {
    this.profileForm = this.fb.group({
      nombre: [''],
      correo: [''],
      imagen: ['']
    });
  }

  ngOnInit(): void {
    this.configService.applyStoredPreferences();

    const datosGuardados = localStorage.getItem('usuario');
    if (datosGuardados) {
      this.profileForm.setValue(JSON.parse(datosGuardados));
    }
  }

  guardar(): void {
    const datos = this.profileForm.value;
    localStorage.setItem('usuario', JSON.stringify(datos));
    this.mensajeConfirmacion = '✅ Datos guardados exitosamente.';
    setTimeout(() => {
      this.mensajeConfirmacion = '';
    }, 3000);
  }

  toggleModoOscuro(): void {
    const nuevoEstado = !this.configService.getModoOscuro();
    this.configService.setModoOscuro(nuevoEstado);
  }

  toggleContraste(): void {
    const nuevoEstado = !this.configService.getContrasteAlto();
    this.configService.setContrasteAlto(nuevoEstado);
  }

  aumentarFuente(): void {
    document.body.style.fontSize = '1.2em';
  }

  resetearFuente(): void {
    document.body.style.fontSize = '';
  }

  volver(): void {
    this.router.navigate(['/login']);
  }
}
