import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule } from '@coreui/angular';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-add-location',
  standalone: true,
  imports: [ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-location.component.html',
  styleUrl: './add-location.component.scss'
})
export class AddLocationComponent {
  visible = false;
  locationForm!: FormGroup;
  @Output() updated = new EventEmitter<boolean>();

  handleLiveDemoChange(visibleStatus: boolean) {
    
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  fb = inject(FormBuilder);
  locationService = inject(LocationService);

  initLocationForm() {
    this.locationForm = this.fb.group({
      locationCode: [''],
      locationName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initLocationForm();
  }

  saveLocation() {
    if (this.locationForm?.valid) {
      this.locationService.saveLocation(this.locationForm?.value).subscribe({
        next: (response) => {
          console.log(response);
          this.visible = false;
          this.locationForm.reset();
          this.updated.emit(true);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
}
