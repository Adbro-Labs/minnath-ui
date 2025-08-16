import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule, ButtonModule, TableModule, GridModule, SpinnerModule } from '@coreui/angular';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-list-items',
  standalone: true,
  imports: [ CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    SpinnerModule,
    GridModule],
  templateUrl: './list-items.component.html',
  styleUrl: './list-items.component.scss'
})
export class ListItemsComponent implements OnInit {
  items: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private itemService: ItemService, private router: Router) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    // this.itemService.getItemWithVariants().subscribe({
    //   next: (data: any) => {
    //     this.items = data;
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     this.errorMessage = '❌ Failed to load items';
    //     console.error(err);
    //     this.loading = false;
    //   }
    // });
  }

  goToAddItem() {
    this.router.navigate(['/add-item']);
  }
}
