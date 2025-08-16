import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule } from '@coreui/angular';
import { Banks } from 'src/app/models/banks';
import { Locations } from 'src/app/models/location';
import { BankService } from 'src/app/services/bank.service';
import { ClientService } from 'src/app/services/client.service';
import { LocationService } from 'src/app/services/location.service';
@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent, ButtonModule, FormsModule, ReactiveFormsModule, FormModule ],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent implements OnInit {
  visible = false;
  clientForm!: FormGroup;
  @Output() updated = new EventEmitter<boolean>();
  locationList: Locations[] = [];
  bankList: Banks[] = [];

  fb = inject(FormBuilder);
  clientService = inject(ClientService);
  locationService = inject(LocationService);
  bankService = inject(BankService);

  ngOnInit(): void {
    this.initClientForm();
    this.getLocations();
    this.getActiveBanks();
  }

  handleLiveDemoChange(visibleStatus: boolean) {
    this.visible = visibleStatus;
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
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

  getActiveBanks() {
    this.bankService.getAllActiveBanks().subscribe({
      next: (response) => {
        this.bankList = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  initClientForm() {
    this.clientForm = this.fb.group({
      clientCode: [''],
      clientName: ['', Validators.required],
      locationCode: ['', Validators.required],
      currentBalance: [null, Validators.required],
      creditLimit: ['', Validators.required],
      bankCode: ['', Validators.required],
      invoiceCode: [''],
      contactPersonName: [''],
      contactNumber: [''],
      clientRollCode: ['']
    });
  }

  saveClient() {
    if (this.clientForm?.valid) {
      this.clientService.saveClient(this.clientForm?.value).subscribe({
        next: (response) => {
          console.log(response);
          this.visible = false;
          this.clientForm.reset();
          this.updated.emit(true);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
}
