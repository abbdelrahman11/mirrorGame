import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router
  ) {}
  form!: FormGroup;

  createForm() {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, Validators.required],
      password: [null, Validators.required],
    });
  }
  ngOnInit(): void {
    this.createForm();
  }
  signup() {
    this.service.signup(this.form.value).subscribe({
      next: () => this.handelSuccess(),
    });
  }
  SignupWithGoogle() {
    window.open(`${environment.baseUrl}/auth/google/callback`, '_self');
  }
  handelSuccess() {
    this.router.navigateByUrl("/auth/login")
  }
}
