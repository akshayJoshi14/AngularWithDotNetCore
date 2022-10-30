import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  bsseUrl = 'https://localhost:7223/api/';
  
  constructor(private http: HttpClient) { }

  login(model: any){
    return this.http.post(this.bsseUrl + 'account/login', model);
  }
}
