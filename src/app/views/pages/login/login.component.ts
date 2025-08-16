import { Component, OnInit, inject } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from "../../../services/users.service";
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent,
      TextColorDirective, CardComponent, CardBodyComponent, FormDirective,
      InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective,
      ButtonDirective, NgStyle, ReactiveFormsModule, FormsModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  fb = inject(FormBuilder);

  userService = inject(UsersService);
  router = inject(Router);

  errorDetails: any;
  
  constructor() { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  authenticate() {
    if (this.loginForm.valid) {
      this.errorDetails = "";
      this.userService.authenticate(this.loginForm.value).subscribe({
        next: (response) => {
          this.userService.setAuthToken(response.accessToken);
          this.router.navigate(['/']);
        },
        error: (errorDetails) => {
          if (errorDetails.status == 401) {
            this.errorDetails = "Invalid Username or password";
          } else {
            console.error(errorDetails);
          }
        }
      });
    }
  }
  

}
