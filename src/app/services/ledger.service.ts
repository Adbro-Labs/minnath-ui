import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Ledger } from '../models/ledger';

@Injectable({
  providedIn: 'root'
})
export class LedgerService {

  private http = inject(HttpClient);

  constructor() { }

  getAllLedgers = (accountHead: string, year:string, month: string) => {
    let url = environment.baseUrl + `/ledger?headCode=${accountHead}&year=${year}&month=${month}`;
    return this.http.get<Ledger[]>(url);
  }                              
}
