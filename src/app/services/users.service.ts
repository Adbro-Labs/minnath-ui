import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Users } from '../models/users';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);

  constructor() { }


  getAllUsers = () => {
    const url = environment.baseUrl + "/users";
    return this.http.get<Users[]>(url);
  }

  saveUser = (body: any) => {
    const url = environment.baseUrl + "/users";
    return this.http.post<Users>(url, body);
  }

  authenticate = (body: any) => {
    const url = environment.baseUrl + "/auth";
    return this.http.post<Users>(url, body);
  }

  setAuthToken(token: string) {
    localStorage.setItem("isLoggedIn", 'true');
    localStorage.setItem("authToken", token);
  }

  getAuthToken() {
    return localStorage.getItem("authToken");
  }

  isLoggedIn() {
    return JSON.parse(localStorage.getItem("isLoggedIn") || 'false');
  }

  decodeAuthToken() {
    try {
      const tokenString = this.getAuthToken();
      if (tokenString) {
        const payload = jwtDecode(tokenString);
        return payload;
      }
      return null;     
    } catch {
      return null;
    }
  }

  isAdmin() {
    const tokenPayload: any = this.decodeAuthToken();
    if (tokenPayload) {
      const userType = tokenPayload?.userType;
      return userType == 'ADMIN';
    }
    return false;
  }

  clearSession() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
  }
}
