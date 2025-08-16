import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective } from '@coreui/angular';
import dayjs from 'dayjs';
import { LPO } from 'src/app/models/lpo';
import { Vehicle } from 'src/app/models/vehicle';
import { ProjectService } from 'src/app/services/project.service';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule, ReactiveFormsModule, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss'
})
export class AddTransactionComponent implements OnInit{
  fb =  inject(FormBuilder);
  transactionForm!: FormGroup;
  visible = false;
  editMode = false;
  transactionTypes = [
    {code: 'TSEWATER_SUPPLY', label: 'Supply of TSE Water'},
    {code: 'TSEWATER_SUPPLY_3000', label: 'Supply of TSE Water 3000 Gallon', quantity: 6500},
    {code: 'TSEWATER_SUPPLY_6500', label: 'Supply of TSE Water 6500 Gallon', quantity: 6500},
    {code: 'TSEWATER_SUPPLY_6000', label: 'Supply of TSE Water 6000 Gallon', quantity: 6000},
    {code: 'TSEWATER_SUPPLY_4500', label: 'Supply of TSE Water 4500 Gallon', quantity: 4500},
    {code: 'SWEETWATER_SUPPLY', label: 'Supply of Sweet Water'},
    {code: 'SWEETWATER_SUPPLY_3000', label: 'Supply of Sweet Water 3000 Gallon', quantity: 3000},
    {code: 'SWEETWATER_SUPPLY_3150', label: 'Supply of Sweet Water 3150 Gallon', quantity: 3150},
    {code: 'SWEETWATER_SUPPLY_3500', label: 'Supply of Sweet Water 3500 Gallon', quantity: 3500},
    {code: 'SWEETWATER_SUPPLY_4500', label: 'Supply of Sweet Water 4500 Gallon', quantity: 4500},
    {code: 'SEWAGE_REMOVAL_4500', label: 'Sewage Removal 4500 Gallon', quantity: 4500},
    {code: 'SEWAGE_REMOVAL_5000', label: 'Sewage Removal 5000 Gallon', quantity: 5000},
    {code: 'SEWAGE_REMOVAL_6000', label: 'Sewage Removal 6000 Gallon', quantity: 6000},
    {code: 'VEHICLE_FUEL', label: 'Vehicle Fuel'},
    {code: '7M3_SKIP', label: '7m3 Skip Removal'},
    {code: 'GENERAL_WASTE_REMOVAL', label: 'General Waste Removal'},
    {code: 'SEWAGE_COLLECTION', label: 'Sewage Water Collection and Disposal'},
    {code: 'DRAIN_EXT_6000', label: 'Drain Extracted water collection 6000 GL'},
    {code: 'JETT_TANKER', label: 'High pressure jetting tanker'},
    {code: 'DUMP_TRUCK_32C', label: 'Dump Truck 32 Cubic'},
    {code: 'FLATBED_40FT', label: 'Flatbed trailer 40 feet'},
    {code: 'DUMP_TRUCK_25T', label: 'Dump Truck 25 Ton'},
    {code: 'OTHER', label: 'Others'}
  ];
  service = inject(ProjectService);
  vehicleService = inject(VehicleService);
  lpoDetails: LPO[] | undefined;
  vehicleList: Vehicle[] = [];
  warningMessage = "";
  showDescriptionField = false;
  disableSave = false;
  previousTransactions: any = {};
  
  @Output() updated = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.initTransactionForm();
    this.getAllVehicles();
    this.transactionForm.get('lpoCode')?.valueChanges.subscribe({
      next: (lpoCode: string) => {
        const lpoData = this.lpoDetails?.find(x => x.lpoCode == lpoCode);
        const transactionType = this.transactionForm.get('transactionType')?.value;
        // if (lpoData && (transactionType == 'Trip Entry' || )) {
        //   this.transactionForm.get('unitPrice')?.setValue(lpoData.unitPrice);
        // } else {
        //   this.transactionForm.get('unitPrice')?.setValue(0);
        // }
        this.calculateAmount();
        if (!this.editMode) {
          const previousTransactionDetails = this.previousTransactions[lpoCode];
          if(previousTransactionDetails) {
            this.transactionForm.get('transactionType')?.setValue(previousTransactionDetails.transactionType);
            if (previousTransactionDetails.vehicleCode) {
              this.transactionForm.get('vehicleCode')?.setValue(previousTransactionDetails.vehicleCode);
              this.transactionForm.get('vehicleNumber')?.setValue(previousTransactionDetails.vehicleNumber);
            }
            this.transactionForm.get('deliveryNoteNumber')?.setValue(Number(previousTransactionDetails.deliveryNoteNumber) + 1);
            const transactionDateList = previousTransactionDetails.transactionDate.split("/");
            const dateObj = new Date(transactionDateList[2], Number(transactionDateList[1]) - 1, Number(transactionDateList[0]) + 1);
            this.transactionForm.get('transactionDate')?.setValue(dayjs(dateObj).format('YYYY-MM-DD'));
          }
        }
      }
    });
    this.transactionForm.get('quantity')?.valueChanges.subscribe({
      next: () => {
        this.calculateAmount();
      }
    });
    this.transactionForm.get('transactionType')?.valueChanges.subscribe({
      next: (transactionType) => {
        const selectedLPOCode = this.transactionForm.get('lpoCode')?.value;
        const lpoData = this.lpoDetails?.find(x => x.lpoCode == selectedLPOCode);
        if (lpoData && transactionType != 'Vehicle fuel') {
          this.transactionForm.get('unitPrice')?.setValue(lpoData.unitPrice);
        } else {
          this.transactionForm.get('unitPrice')?.setValue(0);
        }
        this.calculateAmount();
      }
    });
    this.transactionForm.get('unitPrice')?.valueChanges.subscribe({
      next: () => {
        this.calculateAmount();
      }
    });
  }

  calculateAmount() {
    const lpoCode = this.transactionForm.get('lpoCode')?.value;
    const lpoData = this.lpoDetails?.find(x => x.lpoCode == lpoCode);
    const transactionType = this.transactionForm.get('transactionType')?.value;
    if (transactionType) {
      const transaction = this.transactionTypes.find(x => x.code == transactionType);
      const quantity = this.transactionForm.get('quantity')?.value;
      if (transaction && transaction.quantity && quantity < 1) {
        this.transactionForm.get('quantity')?.setValue(transaction.quantity);
      }
    }
    if (lpoData && lpoData.lpoType) {
      const unitPrice = this.transactionForm.get('unitPrice')?.value;
      const quantity = this.transactionForm.get('quantity')?.value;
      if (lpoData.lpoType == 'TRIP') {
        if (unitPrice > 0) {
          if (transactionType == "OTHER") {
            this.transactionForm.get('amount')?.setValue(unitPrice * quantity);
          } else {
            this.transactionForm.get('unitDescription')?.setValue('Trip');
            this.transactionForm.get('amount')?.setValue(unitPrice);
          }
        } else {
          this.transactionForm.get('amount')?.setValue(0);
        }
      } else {
        if (unitPrice > 0 && quantity > 0) {
          this.transactionForm.get('unitDescription')?.setValue('Gallon');
          this.transactionForm.get('amount')?.setValue(unitPrice * quantity);
        } else {
          this.transactionForm.get('amount')?.setValue(0);
        }
      }
      this.validateLPO();
    }
  }

  validateLPO() {
    const selectedLPOCode = this.transactionForm.get('lpoCode')?.value;
    if (selectedLPOCode) {
      const lpoData = this.lpoDetails?.find(x => x.lpoCode == selectedLPOCode);
      if (lpoData?.lpoType == 'QUANTITY') {
          const currentQuantity = this.transactionForm.get('quantity')?.value;
          if (currentQuantity > lpoData.currentLimit) {
            this.warningMessage = "currently selected quantity is higher than LPO Limit";
          } else {
            this.warningMessage = "";
          }
      } 
      if (lpoData?.lpoType == 'AMOUNT') {
        const currentAmount = this.transactionForm.get('amount')?.value;
        if (currentAmount > lpoData.currentLimit) {
          this.warningMessage = "current amount is higher than LPO Limit";
        } else {
          this.warningMessage = "";
        }
      }
    }
  }


  initTransactionForm() {
    this.transactionForm = this.fb.group({
      transactionCode: [null],
      transactionDate: [''],
      transactionType: ['', Validators.required],
      transactionDescription: [''],
      unitDescription: ['', Validators.required],
      lpoCode: ['', Validators.required],
      projectCode: ['', Validators.required],
      unitPrice: ['', Validators.required],
      amount: [{value: '', disabled: true}, Validators.required],
      quantity: ['', Validators.required],
      clientCode: ['', Validators.required],
      vehicleCode: ['', Validators.required],
      vehicleNumber: [''],
      description: [''],
      deliveryNoteNumber: [''],
      hideInTripSummary: [false]
    });
    this.transactionForm.get('transactionType')?.valueChanges.subscribe({
      next: (transactionType) => {
        if (transactionType != 'OTHER') {
          this.transactionForm.get('unitDescription')?.setValue('Gallon');
        } else {
          this.transactionForm.get('unitDescription')?.setValue('');
        }
      }
    })
  }

  handleLiveDemoChange(visibleStatus: boolean) {
    this.visible = visibleStatus;
    this.editMode = false;
    if (!this.visible) {
      this.transactionForm.reset();
    }
  }

  closeDialog() {
    this.editMode = false;
    this.visible = false;
    this.transactionForm.reset();
  }

  addTransaction() {
    if (this.transactionForm?.valid) {
      this.disableSave = true;
      this.service.saveTransaction(this.transactionForm?.getRawValue()).subscribe({
        next: () => {
          this.editMode = false;
          this.lpoDetails = [];
          this.visible = false;
          this.disableSave = false;
          this.transactionForm.reset();
          this.updated.emit(true);
        },
        error: (error) => {
          this.editMode = false;
          this.disableSave = false;
          console.error(error);
        }
      });
    }
  }

  getAllVehicles() {
    this.vehicleService.getAllVehicles().subscribe({
      next: (response) => {
        this.vehicleList = response;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

}
