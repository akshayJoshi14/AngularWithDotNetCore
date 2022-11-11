import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors : string[] = [];

  constructor(private accountService : AccountService, private router: Router,
    private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.IntializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  IntializeForm(){
    this.registerForm = this.fb.group({
      username: ['',Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword : ['',[Validators.required, this.matchValues('password')]],
      gender : ['male'],
      knownAs : ['',Validators.required],
      dateOfBirth : ['',Validators.required],
      city : ['',Validators.required],
      country : ['',Validators.required],
    })

    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  // Custom validator
  matchValues(matchTo: string) : ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
      ? null: {isMatching: true}
    }
  }

   register(){
   // console.log(this.registerForm.value);
    
    this.accountService.register(this.registerForm.value).subscribe(response => {
      //console.log(response);
      //this.cancel();

      this.router.navigateByUrl('/members');
      
    }, error => {
      this.validationErrors = error;
      // console.log(error);
      // this.toastr.error(error.error);
    } )
   }

   cancel(){
    this.cancelRegister.emit(false);
   }
}

