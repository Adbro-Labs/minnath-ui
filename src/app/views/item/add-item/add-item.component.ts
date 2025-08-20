import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule, ButtonModule, FormModule, GridModule, ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent } from '@coreui/angular';
import { ItemService } from '../../../services/item.service';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [CommonModule,
    ModalComponent,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    FormModule,
    GridModule,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss'
})
export class AddItemComponent {
  itemForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  visible = false;
  @Output() updated = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService
  ) {
    this.itemForm = this.fb.group({
      itemName: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.itemService.createItem(this.itemForm.value).subscribe({
        next: (res) => {
          this.successMessage = 'Item added successfully!';
          this.errorMessage = '';
          this.itemForm.reset();
          this.visible = false;
          this.updated.emit(true);
        },
        error: (err) => {
          this.errorMessage = 'Error adding item';
          this.successMessage = '';
          console.error(err);
        }
      });
    }
  }

  handleLiveDemoChange(visibleStatus: boolean) {
    this.visible = visibleStatus;
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }


}
