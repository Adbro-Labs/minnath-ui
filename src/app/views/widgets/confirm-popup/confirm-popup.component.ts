import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule } from '@coreui/angular';
import { LpoService } from "../../../services/lpo.service";
import { LPO } from 'src/app/models/lpo';

@Component({
  selector: 'app-confirm-popup',
  standalone: true,
  imports: [ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule, ReactiveFormsModule],
  templateUrl: './confirm-popup.component.html',
  styleUrl: './confirm-popup.component.scss'
})
export class ConfirmPopupComponent {
  visible = false;
  invoiceCode = "";
  @Output() confirmUpdate = new EventEmitter<string>(false);
  handleLiveDemoChange(visibleStatus: boolean) {
    this.visible = visibleStatus;
  }

  closeDialog() {
    this.visible = false;
  }

  confirmAction() {
    this.confirmUpdate.emit(this.invoiceCode);
    this.visible = false;
  }
}
