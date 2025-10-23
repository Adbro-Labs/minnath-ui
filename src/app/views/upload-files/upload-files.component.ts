import { Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule, ProgressBarDirective, ProgressStackedComponent, ProgressBarComponent } from '@coreui/angular';
import { LpoService } from '../../services/lpo.service';
import { ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { ProgressComponent } from '@coreui/angular';
@Component({
  selector: 'app-upload-files',
  standalone: true,
  imports: [ProgressStackedComponent, ProgressBarComponent, ProgressBarDirective, ButtonModule, ModalBodyComponent, ProgressComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule, ReactiveFormsModule],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.scss'
})
export class UploadFilesComponent {
    visible = false;
    attachmentForm!: FormGroup;
    editMode = false;
    disableSave = false;
    @Output() updated = new EventEmitter<boolean>();
    @ViewChild('fileuploader') uploader!:  ElementRef<HTMLInputElement>;
    selectedFile: FileList | null = null;
    fb = inject(FormBuilder);
    service = inject(LpoService);
    route = inject(ActivatedRoute);
    clientCode: string = "";
    uploadProgress = 0;
    

    projectType = [{
      code: 'INVOICE',
      label: 'Invoice'
    },{
      code: 'DOCUMENT',
      label: 'Document'
    },
    ];
    ngOnInit(): void {
      this.initLPOForm();
      this.route.params.subscribe({
        next: (response) => {
          if (response?.["clientCode"]) {
            this.clientCode = response["clientCode"];
            this.setClientCode();
          }
        }
      })
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
      this.attachmentForm = this.fb.group({
        attachmentCode: [null],
        clientCode: ['', Validators.required],
        description: [''],
        amount: [null],
        fileCategory: [''],
        invoiceDate: [],
        invoiceCode: ['']
      });
    }
  
    closeDialog() {
      this.attachmentForm.reset();
      this.attachmentForm.enable();
      this.setClientCode();
      this.clearUploader();
      this.editMode = false;
      this.visible = false;
    }
  
    saveLPO() {
      if (this.attachmentForm.valid) {
        this.disableSave = true;
        const formData = new FormData();
        if (this.selectedFile) {
          Array.from(this.selectedFile).forEach(file => {
            formData.append("file", file); // same name "file" for all files
          });
        }
        formData.append('attachmentDetails', JSON.stringify(this.attachmentForm.getRawValue()));
        this.uploadProgress = 0; 
        this.service.saveLPO(formData).subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.uploadProgress = Math.round((100 * event.loaded) / (event.total || 1));
            } else if (event.type === HttpEventType.Response) {
                this.disableSave = false;
                this.visible = false;
                this.editMode = false;
                this.attachmentForm.reset();
                this.attachmentForm.enable();
                this.setClientCode();
                this.clearUploader();
                this.updated.emit(true);
            }
          },
          error: (error: any) => {
            this.disableSave = false;
            console.error(error);
          }
        });
      }
    }
  
    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files;
      }
    }
  
    clearUploader() {
      if (this.uploader) {
        this.uploader.nativeElement.value = "";
      }
    }

    setClientCode() {
      this.attachmentForm.get("clientCode")?.setValue(this.clientCode);
    }
}
