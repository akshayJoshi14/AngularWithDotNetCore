import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //@Input() usersFromHomeComponent : any;
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  registerForm: FormGroup;

  constructor(private accountService : AccountService, private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
 this.IntializeForm()
  }

  IntializeForm(){
    this.registerForm = new FormGroup({
      username: new FormControl('Hello',Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword : new FormControl('',[Validators.required, this.matchValues('password')])
    })
    
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  // Custom validator
  matchValues(matchTo: string) : ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
      ? null: {isMatching: false}
    }
  }

   register(){
    console.log(this.registerForm.value);
    // this.accountService.register(this.model).subscribe(response => {
    //   console.log(response);
    //   this.cancel();
    // }, error => {
    //   console.log(error);
    //   this.toastr.error(error.error);
    // } )
   }

   cancel(){
    this.cancelRegister.emit(false);
   }
}

