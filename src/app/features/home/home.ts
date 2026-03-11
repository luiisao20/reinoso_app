import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  regexName = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
  regexPhone = /^\+?\d+$/;
  regexActivity = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const isRegistered: boolean = localStorage.getItem('reinoso-registered') === 'true';

    if (isRegistered) {
      this.router.navigate(['error']);
    }
  }

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(this.regexName)]],
    phone: ['', [Validators.required, Validators.pattern(this.regexPhone)]],
    activity: ['', [Validators.required, Validators.pattern(this.regexActivity)]],
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

  registerAction() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    localStorage.setItem('reinoso-registered', 'true');
    this.router.navigate(['success'], {
      state: {
        name: this.registerForm.get('name')?.value,
        phone: this.registerForm.get('phone')?.value,
      },
    });
  }
}
