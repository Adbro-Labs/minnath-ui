import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from "../models/item";
import { environment } from '../../environments/environment';

const STORAGE_KEY = "quotes";

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiUrl = environment.baseUrl + '/items';

  constructor(private http: HttpClient) { }

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


  // Get complete store object
  private getStore(): Record<string, any> {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  // Save complete store object
  private saveStore(store: Record<string, any>): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  /** Save or update quoteList for a client */
  saveQuotes(clientCode: string, quoteList: any[]): void {
    const store = this.getStore();
    store[clientCode] = quoteList;
    this.saveStore(store);
  }

  /** Get stored quoteList for a specific client */
  getQuotes(clientCode: string): any[] | null {
    const store = this.getStore();
    return store[clientCode] ?? null;
  }

  /** Delete stored quoteList for a client */
  removeQuotes(clientCode: string): void {
    const store = this.getStore();
    if (store[clientCode]) {
      delete store[clientCode];
      this.saveStore(store);
    }
  }

  /** Clear storage completely (optional helper) */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
