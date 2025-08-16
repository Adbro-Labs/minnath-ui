import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule } from '@coreui/angular';
import { AddUserComponent } from "../add-user/add-user.component";
import { BankService } from "../../../services/bank.service";
import { Users } from 'src/app/models/users';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CardComponent, ColComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, AddUserComponent],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export class ListUserComponent {
  @ViewChild('addUser') addUser: AddUserComponent | undefined;
  userDetails: Users[] = [];
  usersService = inject(UsersService);
  constructor() {

  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.usersService.getAllUsers().subscribe({
      next: (response) => {
        this.userDetails = response;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  addBankAccount() {
    if (this.addUser) {
      this.addUser.visible = true;
    }
  }
}
