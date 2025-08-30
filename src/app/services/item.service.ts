import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from "../models/item";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  
  private apiUrl = environment.baseUrl +  '/items';

  constructor(private http: HttpClient) {}

  /** Create item with optional variants */
  createItem(item: Item): Observable<any> {
    return this.http.post(`${this.apiUrl}`, item);
  }

  getAllItems(index: number, searchText = "") {
    const url = this.apiUrl + `?index=${index}&searchText=${searchText}`;
    return this.http.get(url);
  } 

  generateQuote(body: any) {
    const url = `${environment.baseUrl}/quote`;
    return this.http.post(url, body);
  }

  getAllQuotes(clientCode: string, index: number) {
    const url = `${environment.baseUrl}/quote?clientCode=${clientCode}&index=${index}`;
    return this.http.get(url);
  }

  getQuoteDetailsById(quoteId: string) {
    const url = `${environment.baseUrl}/quote/getById?quoteId=${quoteId}`;
    return this.http.get(url);
  }
}
