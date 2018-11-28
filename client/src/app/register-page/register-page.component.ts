import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms'
import {AuthService} from '../shared/services/auth.service'
import {Router} from '@angular/router'
import {Subscription} from 'rxjs'
import {MaterialService} from "../shared/classes/material.service";
import {User} from "../shared/interfaces";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit, OnDestroy {


  @ViewChild('input') inputRef: ElementRef
  form: FormGroup
  image: File
  imagePreview = ''
  isNew = true
  user: User
  aSub: Subscription
  pwdPattern = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s).{8,12}$';


  constructor(private auth: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8),  Validators.pattern(this.pwdPattern)]),
      username: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.minLength(7)]),
    })
  }


  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  onFileUpload2(event: any) {
    const file = event.target.files[0]
    this.image = file
console.log(this.image );
    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }


  onSubmit() {
    const user ={
      email:this.form.value.email,
      password:this.form.value.password,
      username:this.form.value.username,
      phone:this.form.value.phone,
      imageUser: this.image

    }
console.log(this.image.name);
    this.form.disable()
    this.aSub = this.auth.register(user).subscribe(
      () => {
        this.router.navigate(['/login'], {
          queryParams: {
            registered: true
          }
        })
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

}
