import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Clients, ClientsWithBankDetails } from '../models/clients';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);

  constructor() { }


  getAllClients = () => {
    let url = environment.baseUrl + "/clients";
    return this.http.get<ClientsWithBankDetails[]>(url);
  }

  getAllActiveClients = () => {
    let url = environment.baseUrl + "/clients?active=true";
    return this.http.get<Clients[]>(url);
  }

  saveClient = (body: any) => {
    const url = environment.baseUrl + "/clients";
    return this.http.post<Clients>(url, body);
  }
}
