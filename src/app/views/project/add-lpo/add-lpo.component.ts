import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule } from '@coreui/angular';
import { LpoService } from "../../../services/lpo.service";
@Component({
  selector: 'app-add-lpo',
  standalone: true,
  imports: [ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule, ReactiveFormsModule],
  templateUrl: './add-lpo.component.html',
  styleUrl: './add-lpo.component.scss'
})
export class AddLPOComponent implements OnInit{
  visible = false;
  lpoForm!: FormGroup;
  editMode = false;
  disableSave = false;
  lpoType = [
    {type: 'AMOUNT', label: 'Amount Based'},
    {type: 'QUANTITY', label: 'Quantity Based'},
    {type: 'TRIP', label: 'Trip Based'},
    {type: 'MANUAL', label: 'Manual'}
  ];
  @Output() updated = new EventEmitter<boolean>();
  @ViewChild('fileuploader') uploader!:  ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;
  fb = inject(FormBuilder);
  service = inject(LpoService);
  ngOnInit(): void {
    this.initLPOForm();
  }

  handleLiveDemoChange(visibleStatus: boolean) {
    this.visible = visibleStatus;
    if (!this.visible) {
      this.editMode = false;
      this.clearUploader();
      this.closeDialog();
    }
  }

  initLPOForm() {
    this.lpoForm = this.fb.group({
      lpoCode: [null],
      lpoName: ['', Validators.required],
      lpoType: ['', Validators.required],
      limit: [0, [Validators.required, Validators.min(0)]],
      unitPrice: ['', Validators.required],
      projectCode: ['', Validators.required],
      customerPONumber: [''],
      paymentIn: [null]
    });
  }

  closeDialog() {
    this.lpoForm.reset();
    this.lpoForm.enable();
    this.clearUploader();
    this.editMode = false;
    this.visible = false;
  }

  saveLPO() {
    if (this.lpoForm.valid) {
      this.disableSave = true;
      const formData = new FormData();
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
      formData.append('lpoDetails', JSON.stringify(this.lpoForm.getRawValue()));
      this.service.saveLPO(formData).subscribe({
        next: () => {
          this.disableSave = false;
          this.visible = false;
          this.editMode = false;
          this.lpoForm.reset();
          this.lpoForm.enable();
          this.clearUploader();
          this.updated.emit(true);
        },
        error: (error) => {
          this.disableSave = false;
          console.error(error);
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  clearUploader() {
    if (this.uploader) {
      this.uploader.nativeElement.value = "";
    }
  }
}
