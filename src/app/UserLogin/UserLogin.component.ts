import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserloginService } from './UserLoginServices/userlogin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../loginService';

@Component({
    selector: 'UserLogin-component',
    templateUrl: './UserLogin.component.html',
    styleUrls: ['./UserLogin.component.css']
})
export class UserloginComponent implements OnInit {

    @ViewChild("userEmail") _Email: ElementRef;
    loginmodel: LoginModel = new LoginModel();
    constructor(private userservice: UserloginService, private dialogref: MatDialogRef<UserloginComponent>,
        private userLogin: LoginService, private _snackNotify: MatSnackBar) {
    }

    errors: any;
    ngOnInit() {
    }

    ngAfterViewInit() {
        setTimeout(() => { this._Email.nativeElement.focus(); }, 1000);
    }

    onSubmit() {
        this.loginmodel.Useremail = this.userservice.loginform.value.email;
        this.loginmodel.Password = this.userservice.loginform.value.password;

        this.userservice.AuthenticateUser(this.loginmodel)
            .subscribe(
                response => {
                    localStorage.setItem("Token", response.toString());
                    const recievedToken = localStorage.getItem("Token");
                    this.userLogin.setToken(recievedToken);
                    this.dialogref.close();
                    this._snackNotify.open("Login Success!!!", "close", {
                        duration: 5000,
                        verticalPosition: 'top'
                    });
                },
                error => {
                    this.errors = error;
                    this._snackNotify.open("Login Failed", "close", {
                        duration: 5000,
                        verticalPosition: 'top'
                    });
                },
                () => {
                }
            );
    }

    onClose() {
        this.userservice.loginform.reset();
        this.dialogref.close();
    }
}

export class LoginModel {
    public Useremail: string = "";
    public Password: string = "";
}