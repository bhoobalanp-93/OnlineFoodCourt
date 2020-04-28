import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserserviceService } from './UserServices/UserService.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'NewUser-component',
    templateUrl: './NewUser.component.html',
    styleUrls: ['./NewUser.component.css']
})

export class NewuserComponent implements OnInit {

    @ViewChild("fNameInput") _firstName: ElementRef;
    successflag: boolean = false;
    postuserdata = {
        customer_ID: 0,
        first_Name: '',
        last_Name: '',
        cust_ContactNo: '',
        cust_MailID: '',
        cust_Address: '',
        Cust_city: '',
        Cust_password: '',
        Cust_gender: ''
    };

    constructor(private service: UserserviceService, private dialogref: MatDialogRef<NewuserComponent>,
        private _snackBar: MatSnackBar) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        setTimeout(() => { this._firstName.nativeElement.focus(); }, 1000);
    }

    onClear() {
        this.service.form.reset();
        this.service.initializeFormGroup();
    }

    onClose() {
        this.service.form.reset();
        this.service.initializeFormGroup();
        this.dialogref.close();

    }

    onSubmit() {
        this.postuserdata.customer_ID = randomNumber(1, 10000);
        this.postuserdata.first_Name = this.service.form.value.firstname;
        this.postuserdata.last_Name = this.service.form.value.lastname;
        this.postuserdata.cust_MailID = this.service.form.value.email;
        this.postuserdata.cust_ContactNo = this.service.form.value.mobile;
        this.postuserdata.Cust_password = this.service.form.value.confirmpassword;
        this.postuserdata.Cust_gender = this.service.form.value.gender;
        this.postuserdata.cust_Address = this.service.form.value.address;
        this.postuserdata.Cust_city = this.service.form.value.city;

        this.service.createcustomer(this.postuserdata)
            .subscribe(
                Response => console.log("Success!", Response),
                Error => console.error("Error!", Error),
            )
        this.service.form.reset();
        this.successflag = true;
        this._snackBar.open("User Created Successfully!!!", "close", {
            duration: 5000,
            verticalPosition: 'top'
        });
        this.onClose();


        //window.alert("User cretaed Successfully!!")
    }
}


export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}