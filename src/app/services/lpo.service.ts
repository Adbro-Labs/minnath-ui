import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { LPO } from '../models/lpo';

@Injectable({
  providedIn: 'root'
})
export class LpoService {
  
  private http = inject(HttpClient);

  constructor() { }


  getAllLPO = (clientCode: string) => {
    const url = environment.baseUrl + "/attachment/documents?clientCode=" + clientCode;
    return this.http.get<any[]>(url);
  }

  saveLPO = (body: any) => {
    const url = environment.baseUrl + "/attachment/upload";
    return this.http.post<any>(url, body, {
        reportProgress: true,
        observe: 'events'
      });
    }

}
