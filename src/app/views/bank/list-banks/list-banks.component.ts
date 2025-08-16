import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule } from '@coreui/angular';
import { AddBankComponent } from "../add-bank/add-bank.component";
import { BankService } from "../../../services/bank.service";
import { Banks } from 'src/app/models/banks';
@Component({
  selector: 'app-list-banks',
  standalone: true,
  imports: [ CardComponent, ColComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, AddBankComponent],
  providers: [BankService],
  templateUrl: './list-banks.component.html',
  styleUrl: './list-banks.component.scss'
})
export class ListBanksComponent implements OnInit {
  @ViewChild('addbank') addbank: AddBankComponent | undefined;
  bankDetails: Banks[] = [];
  bankService = inject(BankService);

  constructor() {

  }

  ngOnInit(): void {
    this.getAllBanks();
  }

  getAllBanks() {
    this.bankService.getAllBanks().subscribe({
      next: (response) => {
        this.bankDetails = response;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  addBankAccount() {
    if (this.addbank) {
      this.addbank.visible = true;
    }
  }
}
