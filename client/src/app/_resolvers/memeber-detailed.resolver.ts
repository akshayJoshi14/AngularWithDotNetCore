import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';

@Injectable({
  providedIn: 'root'
})
export class MemeberDetailedResolver implements Resolve<Member> {
  constructor(private memeberservice: MembersService){}

  resolve(route: ActivatedRouteSnapshot): Observable<Member> {
    return this.memeberservice.getMember(route.paramMap.get('username')!);
  }
}
