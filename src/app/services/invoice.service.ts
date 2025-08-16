import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private http = inject(HttpClient);

  constructor() { }


  getAllInvoices = () => {
    let url = environment.baseUrl + "/invoice";
    return this.http.get<any>(url);
  }

  updateInvoiceStatus = (body: any) => {
    let url = environment.baseUrl + "/invoice/updateInvoiceStatus";
    return this.http.post<any>(url, body);
  }

  getPendingInvoicesByClientCode = (clientCode: string) => {
    let url = environment.baseUrl + "/invoice/getPendingInvoiceByClient";
    return this.http.post<any>(url, {clientCode});
  }

  settleInvoices = (body: any) => {
    let url = environment.baseUrl + "/invoice/settleInvoice";
    return this.http.post<any>(url, body);
  }

  getAccountStatement = (clientId: string, projectCode = "") => {
    let url = environment.baseUrl + `/invoice/getAccountStatement?clientId=${clientId}&projectCode=${projectCode}`;
    return this.http.get<any>(url);
  }

  generateStatement = (clientId: string, projectCode = "") => {
    let url = environment.baseUrl + `/invoice/generateStatement?clientId=${clientId}&projectCode=${projectCode}`;
    return this.http.get<any>(url);
  }
  
}
