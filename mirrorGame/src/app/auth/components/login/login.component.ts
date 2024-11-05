import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router
  ) {}
  form!: FormGroup;

  createForm() {
    this.form = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }
  ngOnInit(): void {
    this.createForm();
  }
  login() {
    this.service.login(this.form.value).subscribe({
      next: (res) => {
        this.handelSuccess(res);
      },
    });
  }
  SignupWithGoogle() {
    window.open(`${environment.baseUrl}/auth/google/callback`, '_self');
  }
  handelSuccess(res: any) {
    localStorage.setItem('token', res.token);
    this.router.navigate(['game/rooms', res.id]);
  }
  routeToSignup() {
    this.router.navigateByUrl('auth/signup');
  }
}
