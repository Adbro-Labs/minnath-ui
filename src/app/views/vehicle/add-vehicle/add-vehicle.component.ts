import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule } from '@coreui/angular';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent, ButtonModule, FormsModule, ReactiveFormsModule, FormModule],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.scss'
})
export class AddVehicleComponent {
  visible = false;
  vehicleForm!: FormGroup;
  @Output() updated = new EventEmitter<boolean>();
  vehicleTypes = [
    {
      typeCode: 'CAR',
      vehicleType: 'Car'
    },
    {
      vehicleType: 'Trailer',
      typeCode: 'TRAILER'
    },
    {
      vehicleType: 'Tanker',
      typeCode: 'TANKER'
    },
    {
      vehicleType: 'Truck',
      typeCode: 'TRUCK'
    },
    {
      vehicleType: 'Trailer Head',
      typeCode: 'TRAILER_HEAD'
    }
  ];

  fb = inject(FormBuilder);
  vehicleService = inject(VehicleService);

  ngOnInit(): void {
    this.initVehicleForm();
  }

  handleLiveDemoChange(visibleStatus: boolean) {
    
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  initVehicleForm() {
    this.vehicleForm = this.fb.group({
      vechicleCode: [],
      vehicleName: ['', Validators.required],
      vehicleType: ['', Validators.required],
      vehicleNumber: ['', Validators.required],
      ownerName: ['', Validators.required],
      capacity: ['', Validators.required],
      RegistrationNumber: ['', Validators.required],
      expiryDate: ['', Validators.required]
    });
  }

  saveVehicle() {
    if (this.vehicleForm?.valid) {
      this.vehicleService.saveVehicle(this.vehicleForm?.value).subscribe({
        next: (response) => {
          console.log(response);
          this.visible = false;
          this.vehicleForm.reset();
          this.updated.emit(true);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
}
