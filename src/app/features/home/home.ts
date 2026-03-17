import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InfoService } from '../../service/info-service';
import { InfoModel } from '../../models/interfaces';

interface Option {
  name: string;
  value: string;
  id: string;
}

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  options: Option[] = [
    { name: 'Dolores musculares', value: 'option1', id: 'option1' },
    { name: 'Lesión deportiva', value: 'option2', id: 'option2' },
    { name: 'Estrés o tensión muscular', value: 'option3', id: 'option3' },
    { name: 'Rehabilitación', value: 'option4', id: 'option4' },
    { name: 'Sólo quiero probar el servicio', value: 'option5', id: 'option5' },
  ];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private infoService = inject(InfoService);

  regexName = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
  regexPhone = /^0\d{9}$/;
  loading = signal<boolean>(false);

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control?.touched || !control?.invalid) return '';

    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('pattern')) {
      const messages: Record<string, string> = {
        name: 'El nombre solo puede contener letras',
        lastName: 'El apellido solo puede contener letras',
        phone: 'Ingresa un número con 10 dígitos y empiece en 0',
        activity: 'El texto ingresado no es válido',
      };
      return messages[controlName] ?? 'Formato inválido';
    }

    return '';
  }

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(this.regexName)]],
    lastName: ['', [Validators.required, Validators.pattern(this.regexName)]],
    phone: ['', [Validators.required, Validators.pattern(this.regexPhone)]],
    activity: ['', [Validators.required]],
    accept: [false],
    reasons: this.fb.array([]),
  });

  onCheckboxChange(event: any) {
    const reasons = this.registerForm.get('reasons') as FormArray;

    if (event.target.checked) {
      reasons.push(this.fb.control(event.target.value));
    } else {
      const index = reasons.controls.findIndex((x) => x.value === event.target.value);
      reasons.removeAt(index);
    }
  }

  onCheckboxAcceptChange(event: any) {
    this.registerForm.get('accept')?.setValue(event.target.checked);
  }

  registerAction() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const newInfo: InfoModel = {
      activity: this.registerForm.get('activity')?.value!,
      name: this.registerForm.get('name')?.value!,
      phone: this.registerForm.get('phone')?.value!,
      reasons: this.registerForm.get('reasons')?.value! as string[],
      lastName: this.registerForm.get('lastName')?.value!,
      accept: this.registerForm.get('accept')?.value! as any,
    };

    this.infoService.saveInfo(newInfo).subscribe({
      next: (value) => {
        this.registerForm.reset();
        alert('Informacion enviada con exito');
        localStorage.setItem('reinoso-registered', `${value.id}`);
        this.router.navigate(['success'], {
          state: {
            name: value.name,
            phone: value.phone,
          },
        });
      },
      error: (error) => {
        alert(error.message);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
