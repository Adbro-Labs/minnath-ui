import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Vehicle } from '../models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);
  constructor() { }

  getAllVehicles = () => {
    let url = environment.baseUrl + "/vehicles";
    return this.http.get<Vehicle[]>(url);
  }

  getAllActiveVehicles = () => {
    let url = environment.baseUrl + "/vehicles?active=true";
    return this.http.get<Vehicle[]>(url);
  }

  saveVehicle = (body: any) => {
    const url = environment.baseUrl + "/vehicles";
    return this.http.post<Vehicle>(url, body);
  }
}
