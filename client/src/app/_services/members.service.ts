import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

// temp way
// const httpOptions ={
//   headers: new HttpHeaders({
//      Authorization : 'Bearer ' + JSON.parse(localStorage.getItem('user'))?.token 
//   })
// }

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMembers(){
    // temp way
    //return this.http.get<Member[]>(this.baseUrl + 'users', httpOptions);

    return this.http.get<Member[]>(this.baseUrl + 'users')
  }

  getMember(username: string){
    //temp way
    //return this.http.get<Member>(this.baseUrl + 'users/'+ username, httpOptions);

    return this.http.get<Member>(this.baseUrl + 'users/'+ username);
  }

  updateMember(member:Member)
  {
    return this.http.put(this.baseUrl + 'users', member);
  }

}
