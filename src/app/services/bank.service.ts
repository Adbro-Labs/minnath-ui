import { Injectable, inject } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Banks } from "../models/banks";

@Injectable({
  providedIn: 'root'
})
export class BankService {

  private http = inject(HttpClient);

  constructor() { }


  getAllBanks = () => {
    const url = environment.baseUrl + "/banks";
    return this.http.get<Banks[]>(url);
  }

  saveBank = (body: any) => {
    const url = environment.baseUrl + "/banks";
    return this.http.post<Banks>(url, body);
  }

  getAllActiveBanks = () => {
    const url = environment.baseUrl + "/banks?active=true";
    return this.http.get<Banks[]>(url);
  }
  
}
