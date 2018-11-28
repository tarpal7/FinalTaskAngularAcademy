import {Component, OnDestroy, OnInit} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs/index";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  aSub: Subscription
 // pwdPattern = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s).{6,12}$';

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      //password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern(this.pwdPattern)])
      password: new FormControl(null, [Validators.required])
    })

    this.route.queryParams.subscribe((params: Params) =>{
      if(params['registered']){
        MaterialService.toast('Now you can log in using your data')
      }else if (params['accessDenied']){
       MaterialService.toast('Log in first')
      } else if (params['sessionFailed']){
        MaterialService.toast('Please login again')
      }
    })
  }

  ngOnDestroy(){
    if(this.aSub){
    this.aSub.unsubscribe()
    }
  }

  onSubmit() {
    const user ={
      email:this.form.value.email,
      password:this.form.value.password
    }

    this.form.disable();
    this.aSub = this.auth.login(user).subscribe(

      ()=> this.router.navigate(['/history']),
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    );
  }

}
