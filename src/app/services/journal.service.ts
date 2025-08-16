import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Journal } from '../models/journal';
import { JournalHeads } from '../models/journalHeads';
import { JournalEvent } from '../models/JournalEvent';
import { JournalHead } from '../models/journalHead';

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  private http = inject(HttpClient);

  constructor() { }


  getAllJournals = () => {
    let url = environment.baseUrl + "/journal";
    return this.http.get<Journal[]>(url);
  }

  saveJournal = (body: any) => {
    const url = environment.baseUrl + "/journal";
    return this.http.post<Journal>(url, body);
  }

  getAllHeads = () => {
    let url = environment.baseUrl + "/journal/getAllHeads";
    return this.http.get<JournalHead[]>(url);
  }

  getAlljournalEvents = (filterActive = false) => {
    let url = environment.baseUrl + "/journal/journalEvents";
    if(filterActive) {
      url += '?active=true';
    }
    return this.http.get<JournalEvent[]>(url);
  }

  saveJournalEvent = (journalEvent: JournalEvent) => {
    const url = environment.baseUrl + "/journal/journalEvent";
    return this.http.post(url, journalEvent);
  }

  saveJournalHead = (journalHead: JournalHead) => {
    const url = environment.baseUrl + "/journal/journalHead";
    return this.http.post(url, journalHead);
  }

}
