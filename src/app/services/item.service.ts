import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item, ItemVariant } from "../models/item";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  
  private apiUrl = 'http://localhost:3000/api/items'; // Change if needed

  constructor(private http: HttpClient) {}

  /** Create item with optional variants */
  createItem(item: Item): Observable<any> {
    return this.http.post(`${this.apiUrl}`, item);
  }

  /** Add variants to an existing item */
  addVariants(itemId: number, variants: ItemVariant[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/${itemId}/variants`, { variants });
  }

  /** Get item with variants */
  getItemWithVariants(itemId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${itemId}`);
  }
}
