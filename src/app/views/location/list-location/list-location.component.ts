import { Component, ViewChild, inject } from '@angular/core';
import { AddLocationComponent } from '../add-location/add-location.component';
import { Locations } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location.service';
import { ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule } from '@coreui/angular';

@Component({
  selector: 'app-list-location',
  standalone: true,
  imports: [CardComponent, ColComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, AddLocationComponent],
  templateUrl: './list-location.component.html',
  styleUrl: './list-location.component.scss'
})
export class ListLocationComponent {
  @ViewChild('addlocation') addlocation: AddLocationComponent | undefined;
  locationDetails: Locations[] = [];
  locationService = inject(LocationService);

  constructor() {

  }

  ngOnInit(): void {
    this.getAllLocations();
  }

  getAllLocations() {
    this.locationService.getAllLocations().subscribe({
      next: (response) => {
        this.locationDetails = response;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  addBankAccount() {
    if (this.addlocation) {
      this.addlocation.visible = true;
    }
  }
}
