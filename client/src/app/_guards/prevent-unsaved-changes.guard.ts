import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { ConfirmService } from '../_services/confirm.service';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {
  constructor(private confrimSerivce : ConfirmService) {}
  canDeactivate(component: MemberEditComponent): Observable<boolean> {
      if(component.editForm?.dirty){
        return this.confrimSerivce.confirm()
      }
    return of(true);
  }
}
