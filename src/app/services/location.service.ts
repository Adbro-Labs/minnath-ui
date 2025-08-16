import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Locations } from '../models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private http = inject(HttpClient);
  constructor() { }

  getAllLocations = () => {
    let url = environment.baseUrl + "/locations";
    return this.http.get<Locations[]>(url);
  }

  getAllActiveLocations = () => {
    let url = environment.baseUrl + "/locations?active=true";
    return this.http.get<Locations[]>(url);
  }

  saveLocation = (body: any) => {
    const url = environment.baseUrl + "/locations";
    return this.http.post<Locations>(url, body);
  }
}
