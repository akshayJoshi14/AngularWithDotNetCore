import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
  members : Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers(){
    // temp way
    //return this.http.get<Member[]>(this.baseUrl + 'users', httpOptions);
    if(this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members => {
        this.members = members;
        return members;
      })
    )


  }

  getMember(username: string){
    //temp way
    //return this.http.get<Member>(this.baseUrl + 'users/'+ username, httpOptions);
    const memeber = this.members.find(x => x.username === username);
    if(this.members !== undefined) return of(memeber);
    return this.http.get<Member>(this.baseUrl + 'users/'+ username);
  }

  updateMember(member:Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(()=> {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

}
