import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project';
import { Transaction } from '../models/transaction';
import { InvoiceSummary } from "../models/InvoiceSummary";
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private http = inject(HttpClient);

  constructor() { }

 appendParamsToUrl(baseUrl: string, params: any) {
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");
  const separator = baseUrl.includes("?") ? "&" : "?";
  return baseUrl + separator + queryString;
}


  getAllProjects = (params: any) => {
    let url = environment.baseUrl + "/projects";
    url = this.appendParamsToUrl(url, params);
    return this.http.get<Project[]>(url);
  }

  saveProject = (body: any) => {
    const url = environment.baseUrl + "/projects";
    return this.http.post<Project>(url, body);
  }

  getProjectDetails = (projectId: string) => {
    const url = environment.baseUrl + "/projects/getProjectDetails?projectCode=" + projectId;
    return this.http.get<Project>(url);
  }

  saveTransaction = (body: any) => {
    const url = environment.baseUrl + "/projects/saveTransaction";
    return this.http.post<Project>(url, body);
  }

  getProjectTransactions(projectId: string) {
    const url = environment.baseUrl + "/projects/getTransactionsByProject?projectCode=" + projectId;
    return this.http.get<Transaction[]>(url);
  }

  getProjectSummary(filter: any) {
    const url = environment.baseUrl + "/projects/getProjectSummary";
    return this.http.post<InvoiceSummary>(url, filter);
  }

  getTripSummary(lpoCode: string) {
    const url = environment.baseUrl + "/projects/getTripSummary?lpoCode=" + lpoCode;
    return this.http.get<InvoiceSummary>(url);
  }

  getProjectInvoiceTemplate() {
    const url = "/assets/html/invoice.html";
    return this.http.get(url, {responseType: "text"});
  }

  getLedgerTemplate() {
    const url = "/assets/html/ledger.html";
    return this.http.get(url, {responseType: "text"});
  }


}
