import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(private fb: FormBuilder, private service: AuthService) {}
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
  login() {
    this.service.signup(this.form.value).subscribe({
      next: () => {},
    });
  }
}
