import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import firebase from 'firebase';
import { MatSnackBar } from '@angular/material/snack-bar';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signupForm: FormGroup;
  ref = firebase.database().ref('users/');

  constructor(private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      'userName' : [null, Validators.required],
      'password' : [null, Validators.required],
      'email' : [null, Validators.required]
    });
  }

  onFormSubmit(form: any) {
    const signup = form;
        const newUser = firebase.database().ref('users/').push();
        newUser.set(signup);
        localStorage.setItem('userName', signup.userName);
        this.router.navigate(['/chat',signup.userName]);

      }
}
