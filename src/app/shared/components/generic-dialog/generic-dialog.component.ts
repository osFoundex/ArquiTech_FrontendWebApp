import { Component, Inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
  MatDialogActions
} from '@angular/material/dialog';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';

export interface FormFieldConfig {
  name: string;
  labelKey: string; // Clave de traducción (ej: 'materials.name')
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  requiredMessageKey?: string;
  options?: { value: string; labelKey: string }[]; // Para mat-select
  value?: any; // Valor por defecto del campo
  min?: number; // Para campos numéricos
  max?: number; // Para campos numéricos
}

export interface DialogConfig {
  titleKey: string; // Clave de traducción para el título
  fields: FormFieldConfig[];
  submitKey: string; // Clave para el botón de enviar
  cancelKey: string; // Clave para el botón de cancelar
}

@Component({
  selector: 'app-generic-dialog',
  templateUrl: './generic-dialog.component.html',
  imports: [
    TranslatePipe,
    MatDialogContent,
    ReactiveFormsModule,
    NgForOf,
    MatDialogTitle,
    MatFormField,
    MatLabel,
    MatError,
    NgIf,
    MatButton,
    MatInput,
    MatSelect,
    MatOption,
    MatDialogActions
  ],
  styleUrls: ['./generic-dialog.component.css']
})
export class GenericDialogComponent {
  form: FormGroup;


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GenericDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: DialogConfig,
    private translate: TranslateService
  ) {
    const controls = config.fields.reduce((acc, field) => {
      acc[field.name] = [
        field.value !== undefined ? field.value : '',
        field.required ? Validators.required : null
      ];
      return acc;
    }, {} as { [key: string]: any });
    this.form = this.fb.group(controls);
  }

  getErrorMessage(field: FormFieldConfig): string {
    const control = this.form.get(field.name);
    if (!control) return '';

    if (control.hasError('required') && field.requiredMessageKey) {
      return this.translate.instant(field.requiredMessageKey);
    }
    return '';
  }
  onSubmit() {
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

}
