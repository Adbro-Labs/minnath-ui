import { Component, ViewChild, inject } from '@angular/core';
import { AddVehicleComponent } from '../add-vehicle/add-vehicle.component';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Vehicle } from 'src/app/models/vehicle';
import { CardComponent, ColComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule } from '@coreui/angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-vehicle',
  standalone: true,
  imports: [ CardComponent, ColComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, AddVehicleComponent, DatePipe ],
  templateUrl: './list-vehicle.component.html',
  styleUrl: './list-vehicle.component.scss'
})
export class ListVehicleComponent {
  @ViewChild('addvehicle') addvehicle: AddVehicleComponent | undefined;
  vehicleService = inject(VehicleService);
  vehicleList: Vehicle[] = [];

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients() {
    this.vehicleService.getAllVehicles().subscribe({
      next: (response) => {
        this.vehicleList = response;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }


  addVehicle() {
    if (this.addvehicle) {
      this.addvehicle.visible = true;
    }
  } 
}
