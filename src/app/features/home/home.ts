import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InfoService } from '../../service/info-service';
import { InfoModel } from '../../models/interfaces';
import { AuthService } from '../../auth-service';

interface Category {
  name: string;
  age: string;
  sport?: string;
  value: string;
  icon: string;
  idleClass: string;
  activeClass: string;
}

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  categories: Category[] = [
    {
      name: 'Generación de Oro',
      age: '70 años o más',
      value: 'Generación de Oro (70 años o más)',
      icon: '🥇',
      idleClass: 'border-amber-300 bg-white hover:bg-amber-50 shadow-sm hover:shadow-amber-100',
      activeClass: 'border-amber-500 bg-amber-50 ring-2 ring-amber-400 shadow-md shadow-amber-200',
    },
    {
      name: 'Vitalidad en Movimiento',
      age: '50 a 60 años',
      value: 'Vitalidad en Movimiento (50 a 60 años)',
      icon: '🌿',
      idleClass: 'border-green-300 bg-white hover:bg-green-50 shadow-sm hover:shadow-green-100',
      activeClass: 'border-green-500 bg-green-50 ring-2 ring-green-400 shadow-md shadow-green-200',
    },
    {
      name: 'Rendimiento Activo',
      age: '30 a 40 años',
      sport: 'Deportistas',
      value: 'Rendimiento Activo (30 a 40 años deportistas)',
      icon: '🏃',
      idleClass: 'border-blue-300 bg-white hover:bg-blue-50 shadow-sm hover:shadow-blue-100',
      activeClass: 'border-blue-500 bg-blue-50 ring-2 ring-blue-400 shadow-md shadow-blue-200',
    },
    {
      name: 'Desafío Evolución',
      age: '30 a 40 años',
      sport: 'No deportistas',
      value: 'Desafío Evolución (30 a 40 años no deportistas)',
      icon: '💪',
      idleClass: 'border-purple-300 bg-white hover:bg-purple-50 shadow-sm hover:shadow-purple-100',
      activeClass: 'border-purple-500 bg-purple-50 ring-2 ring-purple-400 shadow-md shadow-purple-200',
    },
    {
      name: 'Potencia Élite',
      age: '15 a 30 años',
      sport: 'Deportistas',
      value: 'Potencia Élite (15 a 30 años Deportistas)',
      icon: '⚡',
      idleClass: 'border-orange-300 bg-white hover:bg-orange-50 shadow-sm hover:shadow-orange-100',
      activeClass: 'border-orange-500 bg-orange-50 ring-2 ring-orange-400 shadow-md shadow-orange-200',
    },
    {
      name: 'Nuevos Retadores',
      age: '15 a 30 años',
      sport: 'No deportistas',
      value: 'Nuevos Retadores (15 a 30 años no deportistas)',
      icon: '⭐',
      idleClass: 'border-teal-300 bg-white hover:bg-teal-50 shadow-sm hover:shadow-teal-100',
      activeClass: 'border-teal-500 bg-teal-50 ring-2 ring-teal-400 shadow-md shadow-teal-200',
    },
  ];

  passengerOptions = [1, 2, 3];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private infoService = inject(InfoService);
  private authService = inject(AuthService);

  regexName = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
  loading = signal<boolean>(false);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(this.regexName)]],
    lastName: ['', [Validators.required, Validators.pattern(this.regexName)]],
    age: [null as number | null, [Validators.required, Validators.min(1), Validators.max(120)]],
    category: ['', [Validators.required]],
    needsTransport: [false],
    passengers: [null as number | null],
    attendsLunch: [false],
    confirmed: [false, [Validators.requiredTrue]],
  });

  get needsTransport(): boolean {
    return !!this.registerForm.get('needsTransport')?.value;
  }

  get selectedCategory(): string {
    return this.registerForm.get('category')?.value ?? '';
  }

  selectCategory(value: string) {
    this.registerForm.get('category')?.setValue(value);
    this.registerForm.get('category')?.markAsTouched();
  }

  getCategoryClasses(cat: Category): string {
    const base = 'w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer';
    const state = this.selectedCategory === cat.value ? cat.activeClass : cat.idleClass;
    return `${base} ${state}`;
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control?.touched || !control?.invalid) return '';

    if (control.hasError('required') || control.hasError('requiredTrue'))
      return 'Este campo es obligatorio';
    if (control.hasError('pattern')) {
      const messages: Record<string, string> = {
        name: 'El nombre solo puede contener letras',
        lastName: 'El apellido solo puede contener letras',
      };
      return messages[controlName] ?? 'Formato inválido';
    }
    if (control.hasError('min') || control.hasError('max')) {
      return 'Ingresa una edad válida';
    }

    return '';
  }

  onTransportChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.registerForm.get('needsTransport')?.setValue(checked);
    if (!checked) {
      this.registerForm.get('passengers')?.setValue(null);
    }
  }

  registerAction() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.registerForm.value;

    const newInfo: InfoModel = {
      name: formValue.name!,
      lastName: formValue.lastName!,
      age: formValue.age!,
      category: formValue.category!,
      needsTransport: !!formValue.needsTransport,
      passengers: formValue.needsTransport ? (formValue.passengers ?? null) : null,
      attendsLunch: !!formValue.attendsLunch,
      confirmed: !!formValue.confirmed,
      winner: false,
    };

    this.infoService.saveInfo(newInfo).subscribe({
      next: (value) => {
        this.registerForm.reset();
        alert('Información enviada con éxito');

        if (this.authService.isAuthenticated()) {
          this.router.navigate(['info']);
          return;
        }

        localStorage.setItem('reinoso-registered', `${value.id}`);
        this.router.navigate(['success'], {
          state: {
            name: value.name,
            category: value.category,
          },
        });
      },
      error: (error) => {
        alert(error.message);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
}
