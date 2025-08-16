import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LPO } from '../models/lpo';

@Injectable({
  providedIn: 'root'
})
export class LpoService {
  
  private http = inject(HttpClient);

  constructor() { }


  getAllLPO = () => {
    const url = environment.baseUrl + "/lpo";
    return this.http.get<LPO[]>(url);
  }

  saveLPO = (body: any) => {
    const url = environment.baseUrl + "/lpo";
    return this.http.post<LPO>(url, body);
  }

  getLPOByProject = (projectId: string) => {
    const url = environment.baseUrl + "/lpo/getByProject?projectCode=" + projectId;
    return this.http.get<LPO[]>(url);
  }
}
