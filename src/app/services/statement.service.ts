import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StatementService {
  private http = inject(HttpClient);
  constructor() { }

  getAccountStatement = (index = 0) => {
    let url = environment.baseUrl + "/statement?index=" + index;
    return this.http.get<any[]>(url);
  }

}
