import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);

  constructor() { }


  getAllInvoices = () => {
    let url = environment.baseUrl + "/analytics/getMainStatistics";
    return this.http.get<any>(url);
  }
}
