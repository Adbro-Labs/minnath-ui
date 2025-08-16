import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule } from '@coreui/angular';
import { Locations } from 'src/app/models/location';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent, ButtonModule, FormsModule, ReactiveFormsModule, FormModule ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  visible = false;
  userForm!: FormGroup;
  @Output() updated = new EventEmitter<boolean>();
  userTypes = ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'];

  handleLiveDemoChange(visibleStatus: boolean) {
    this.visible = visibleStatus;
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
    this.userForm.reset();
  }

  fb = inject(FormBuilder);
  userService = inject(UsersService);

  initUserForm() {
    this.userForm = this.fb.group({
      userCode: [''],
      name: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      userType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initUserForm();
  }



  saveUser() {
    if (this.userForm?.valid) {
      this.userService.saveUser(this.userForm?.value).subscribe({
        next: (response) => {
          console.log(response);
          this.visible = false;
          this.userForm.reset();
          this.updated.emit(true);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
}
