
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable()
export class UserserviceService {

    constructor(private httpCustomer: HttpClient) {
        this.form.controls.password.valueChanges.subscribe(
            x => this.form.controls.confirmpassword.updateValueAndValidity()
        )
    }

    initializeFormGroup() {

        this.form.setValue({
            $key: null,
            firstname: '',
            lastname: '',
            password: '',
            confirmpassword: '',
            gender: '1',
            email: '',
            mobile: '',
            address: '',
            city: ''
        })
    }

    form: FormGroup = new FormGroup({
        $key: new FormControl(),
        firstname: new FormControl('', Validators.required),
        lastname: new FormControl(''),
        password: new FormControl('', Validators.required),
        confirmpassword: new FormControl('', [passwordValidator]),
        gender: new FormControl("1"),
        email: new FormControl('', [Validators.required, Validators.email]),
        mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
        address: new FormControl('', Validators.required),
        city: new FormControl(''),
    });

    _CustomerURL = "https://localhost:44384/Api/Customers/PostCustomer";

    createcustomer(data: any): Observable<any> {
        return this.httpCustomer.post<any>(this._CustomerURL, data);
    }
}

export function passwordValidator(control: AbstractControl) {
    if (control && (control.value != null || control.value == undefined)) {
        const cnfPasswordValue = control.value;
        const passwordvalue = control.root.get("password");

        if (passwordvalue) {
            if (passwordvalue.value != cnfPasswordValue) {
                return {
                    isError: true
                }
            }
        }
    }
}