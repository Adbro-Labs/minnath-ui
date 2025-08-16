import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule } from '@coreui/angular';
import { Locations } from 'src/app/models/location';
import { BankService } from 'src/app/services/bank.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-add-bank',
  standalone: true,
  imports: [ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent, ButtonModule, FormsModule, ReactiveFormsModule, FormModule ],
  templateUrl: './add-bank.component.html',
  styleUrl: './add-bank.component.scss'
})
export class AddBankComponent implements OnInit{
  visible = false;
  bankForm!: FormGroup;
  @Output() updated = new EventEmitter<boolean>();
  locationList: Locations[] = [];

  handleLiveDemoChange(visibleStatus: boolean) {
    this.visible = visibleStatus;
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  fb = inject(FormBuilder);
  bankService = inject(BankService);
  locationService = inject(LocationService);

  initBankForm() {
    this.bankForm = this.fb.group({
      bankCode: [''],
      bankName: ['', Validators.required],
      bankAccountNumber: ['', Validators.required],
      accountIBAN: ['', Validators.required],
      branchLocation: ['', Validators.required],
      currentBalance: [null, Validators.required],
      accountHolderName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initBankForm();
    this.getLocations();
  }

  getLocations() {
    this.locationService.getAllActiveLocations().subscribe({
      next: (response) => {
        this.locationList = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  saveBank() {
    if (this.bankForm?.valid) {
      this.bankService.saveBank(this.bankForm?.value).subscribe({
        next: (response) => {
          console.log(response);
          this.visible = false;
          this.bankForm.reset();
          this.updated.emit(true);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
}
