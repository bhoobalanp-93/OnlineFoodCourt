
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { LoginModel } from '../UserLogin.component'

@Injectable()
export class UserloginService {

    constructor(private httpclient: HttpClient) {

    }
    loginform: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
    });

    initializeLoginFormGroup() {
        this.loginform.setValue({
            email: '',
            password: ''
        })
    }
    AuthenticateUser(login: LoginModel) {
        const login_URL = "https://localhost:44384/Api/Login/Authenticate";
        const login_URLIIS = "http://localhost:8080/Api/Login/Authenticate";
        return this.httpclient.post(login_URLIIS, login)
    }

}