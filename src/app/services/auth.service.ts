import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoginModel } from '../models/loginModel';
import { Observable } from 'rxjs';
import { HttpParameterCustomCodec } from './httpParaCustomCodec';
import * as jwt_decode from "jwt-decode";
import { JwtModel } from '../models/jwtModel';
import { CommonModel } from '../models/commonModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl: string = environment.apiPath + environment.getTokenPath;
  private validateTokenUrl: string = environment.apiPath + environment.validateTokenPath;
  headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string): Observable<LoginModel> {
    // Issue on github: https://github.com/angular/angular/issues/18261
    const body = new HttpParams({ encoder: new HttpParameterCustomCodec() })
      .set('username', username)
      .set('password', password);
    return this.http.post<LoginModel>(this.authUrl, body, { headers: this.headers });
  }

  getUsername(): string {
    let token = this.getToken();
    try {
      return jwt_decode<JwtModel>(token).username;
    }
    catch (Error) {
      return null;
    }
  }

  validateToken(): Observable<CommonModel> {
    return this.http.get<CommonModel>(this.validateTokenUrl);
  }

  logout() {
    localStorage.removeItem('token_id');
    this.router.navigate(['/login']);
  }

  setToken(token: string) {
    localStorage.setItem('token_id', token);
  }

  getToken(): string {
    return localStorage.getItem('token_id');
  }

  isLogged() {
    return !!localStorage.getItem('token_id');
  }
}
