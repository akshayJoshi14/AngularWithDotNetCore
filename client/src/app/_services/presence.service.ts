import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { endOf } from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

      this.hubConnection.start().catch(error => console.log(error));

      this.hubConnection.on("UserIsOnline", username => {
        this.toastr.info(username + ' has connected');
      })

      this.hubConnection.on("UserIsOffline", username => {
        this.toastr.warning(username + ' has disconnected');
      })

      this.hubConnection.on("GetOnlineUsers", username => {
        this.onlineUsersSource.next(username);
      })

      this.hubConnection.on("NewMessageReceived", ({username, knownAs}) => {
        this.toastr.info(knownAs + 'sas sent you a new message! Click me to see it')
        .onTap
        .pipe(take(1))
        .subscribe({
          next: () => this.router.navigateByUrl('/memebers/'+ username + '?tab=Messages')
        })
      })
  }

  stopHubConnection(){
    this.hubConnection?.stop().catch(error => console.log(error));
  }
}
