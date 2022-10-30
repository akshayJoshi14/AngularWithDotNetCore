import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users : any;
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  registerToggle(){
    this.registerMode = !this.registerMode;
    this.getUsers();
  }

  getUsers()
  {
    this.http.get('https://localhost:7223/api/Users').subscribe(users => {
      this.users = users;
    }, error => {
      console.log(error);
    });
  }

  cancelRegisterMode(event: boolean){
    this.registerMode = event;
  }

}
