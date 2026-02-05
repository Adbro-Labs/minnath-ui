import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocsService {
  private http = inject(HttpClient);
  constructor() { }

  generateDocument = (clientCode: any) => {
    const url = environment.baseUrl + "/docs/generateDocs?clientCode=" + clientCode;
    return this.http.get(url, { responseType: 'blob' });
  }

  saveClientDetails = (body: any) => {
    const url = environment.baseUrl + "/docs";
    return this.http.post<any>(url, body);
  }
  getclientDetails = (clientId: number) => {
    const url = environment.baseUrl + "/docs?clientCode=" + clientId;
    return this.http.get<any>(url);
  }
}
