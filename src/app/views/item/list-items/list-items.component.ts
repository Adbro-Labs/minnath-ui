import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule, ButtonModule, TableModule, GridModule, SpinnerModule } from '@coreui/angular';
import { ItemService } from '../../../services/item.service';
import { AddItemComponent } from "../add-item/add-item.component";

@Component({
  selector: 'app-list-items',
  standalone: true,
  imports: [ CommonModule, AddItemComponent, 
    CardModule,
    ButtonModule,
    TableModule,
    SpinnerModule,
    GridModule],
  templateUrl: './list-items.component.html',
  styleUrl: './list-items.component.scss'
})
export class ListItemsComponent implements OnInit {

  @ViewChild('addItem') addItem: AddItemComponent | undefined;

  items: any[] = [];
  loading = true;
  errorMessage = '';
  index = 0;
  searchText = "";

  constructor(private itemService: ItemService, private router: Router) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.itemService.getAllItems(this.index, this.searchText).subscribe({
      next: (data: any) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = '❌ Failed to load items';
        console.error(err);
        this.loading = false;
      }
    });
  }

  goToAddItem() {
    this.router.navigate(['/items/add-item']);
  }
  
  showAddItemView() {
    if (this.addItem) {
      this.addItem.visible = true;
    }
  }
}
