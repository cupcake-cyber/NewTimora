import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

import { CardComponent } from '../../components/card/card/card';
import { CardContentComponent } from '../../components/card/card-content/card-content';
import { ButtonComponent } from '../../components/button/button';
import { InputComponent } from '../../components/input/input';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    CardContentComponent,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private router = inject(Router);
  private auth = inject(AuthService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  errorMessage: string | null = null;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.errorMessage = null;
    });
  }

  submit() {
    this.errorMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = '* Please fill all fields correctly';
      return;
    }

    const email = this.form.value.email;
    const password = this.form.value.password;

    if (!email || !password) return;

    this.auth.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/app']);
      },

      error: (err) => {
  console.log('ERROR CALLBACK');
  this.errorMessage = '* Invalid credentials';

  this.cdr.detectChanges();
},
    });
  }
}