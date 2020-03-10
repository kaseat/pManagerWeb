import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginFormModel } from '../models/loginFormModel';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public errMsg: string = null;
  constructor(private formBuilder: FormBuilder, private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    if (this.auth.isLogged()) {
      this.router.navigate(['/dashboard']);
    }
    this.form = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  async login() {
    try {
      var formData: LoginFormModel = this.form.value;
      var response = await this.auth.login(formData.username, formData.password).toPromise();
      this.auth.setToken(response.token);
      this.router.navigate(['/dashboard']);
    }
    catch (err) {
      if (err.status === 502) {
        this.errMsg = 'Cannot reach ' + err.url;
        console.log(this.errMsg);
      };
      if (err.status === 401) {
        this.errMsg = err.error.error;
        console.log(this.errMsg);
      }
      return;
    }
    this.router.navigate(['/dashboard']);
  }
}
