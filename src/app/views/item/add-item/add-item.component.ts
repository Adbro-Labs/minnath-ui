import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule, ButtonModule, FormModule, GridModule } from '@coreui/angular';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    FormModule,
    GridModule,],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss'
})
export class AddItemComponent {
  itemForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
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
        },
        error: (err) => {
          this.errorMessage = 'Error adding item';
          this.successMessage = '';
          console.error(err);
        }
      });
    }
  }
}
