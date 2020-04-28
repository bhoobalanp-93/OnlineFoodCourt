import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FoodDataService } from '../Services/foodService';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginService } from '../loginService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRadioChange, MatRadioButton } from '@angular/material/radio';

@Component({
    selector: 'FoodCart-component',
    templateUrl: './FoodCart.component.html',
    styleUrls: ['./FoodCart.component.css']
})


export class FoodcartComponent implements OnInit {

    ordercartItem: OrderProduct[] = [];
    restaurantID: any;
    restaurantName: any;
    cartTotal = 0;
    curSessionValue: any;
    displayedColumnsFood = ['Item-Name', 'Quantity', 'Price', ''];
    userDetails: any;
    currentUser: any;
    paymentmode: string = "Online";
    postOrderdata = {
        Order_ID: 0,
        RestaurantID: 0,
        orderCustomerId: 0,
        OrderPrice: 0,
        paymentMode: ''
    };

    constructor(private FoodData: FoodDataService, private dialogRef: MatDialogRef<FoodcartComponent>,
        private _snackNotify: MatSnackBar,
        iconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer,
        private loggedUser: LoginService) {
        iconRegistry.addSvgIcon('Add', sanitizer.bypassSecurityTrustResourceUrl('assets/Icons/plus.svg'));
        iconRegistry.addSvgIcon('Remove', sanitizer.bypassSecurityTrustResourceUrl('assets/Icons/minus.svg'));
    }

    ngOnInit() {

        this.FoodData.curSessionTokken.subscribe(data => { this.curSessionValue = data });

        if (this.curSessionValue.length == 0) {
            this.FoodData.currentMessage
                .subscribe(
                    data => {
                        data = data.filter(function (obj) {
                            return obj.quantity != 0;
                        });
                        this.ordercartItem = data;
                    });

            this.FoodData.restaurantName
                .subscribe(data => {
                    this.restaurantName = data;
                });

            this.FoodData.restaurantID
                .subscribe(data => { this.restaurantID = data });

            if (this.ordercartItem.length != 0) {
                this.cartTotal = 0;
                this.ordercartItem.forEach(item => this.cartTotal += item.quantity * item.foodProductPrice)
            }
        }
        else {
            this.removeAllItems();
        }

    }

    removeAllItems() {
        this.ordercartItem.forEach(element => {
            if (element.quantity > 0) {
                element.quantity = element.quantity - element.quantity;
            }
        });

    }

    onRemoveFoodItem(foodProduct) {
        this.ordercartItem.map((item) => {
            if (item.foodProductID == foodProduct.foodProductID) {
                if (item.quantity > 0)
                    item.quantity = item.quantity - 1
            }
        });
        this.ordercartItem = this.ordercartItem.filter(function (obj) {
            return obj.quantity > 0;
        });
        this.FoodData.changedCartValue(this.ordercartItem.length);
        this.ngOnInit();
    }

    onAddFoodItem(foodProduct) {
        this.ordercartItem.map((item) => {
            if (item.foodProductID == foodProduct.foodProductID) {
                item.quantity = item.quantity + 1
            }
        });
        this.ngOnInit();
    }

    onClose() {
        this.dialogRef.close();
    }
    cancelEdit() {
        this.onClose();
    }
    finishEdit() {
        const recievedToken = localStorage.getItem("Token");
        if (recievedToken != null)
            this.loggedUser.setToken(recievedToken);
        this.userDetails = this.loggedUser.getToken();
        if (!this.userDetails) {
            this._snackNotify.open("You must Login to Place order!", "close", {
                duration: 5000,
                verticalPosition: 'top'
            });
        }
        else {
            this.FoodData.UserDetail(this.userDetails.email)
                .subscribe(
                    data => {
                        this.currentUser = data
                        this.postOrderdata.Order_ID = randomNumber(1, 10000);
                        this.postOrderdata.RestaurantID = this.restaurantID;
                        this.postOrderdata.orderCustomerId = this.currentUser.customer_ID;
                        this.postOrderdata.OrderPrice = this.cartTotal;
                        this.postOrderdata.paymentMode = this.paymentmode;
                        this.FoodData.PlaceOrder(this.postOrderdata)
                            .subscribe(
                                Response => {
                                    console.log("Success!", Response)
                                },
                                Error => console.error("Error!", Error),
                            )
                    }
                )
        }
        this._snackNotify.open("Order Successfully placed!!!", "close", {
            duration: 5000,
            verticalPosition: 'top'
        });
        this.ordercartItem = [];
        this.ngOnInit();
        this.onClose();
    }

    onChange(mrChange: MatRadioChange) {
        console.log(mrChange.value);
        let mrButton: MatRadioButton = mrChange.source;
        this.paymentmode = mrChange.value;
        console.log(mrButton.name);
        console.log(mrButton.checked);
        console.log(mrButton.inputId);
    }
}

export class OrderProduct {
    foodProductID: number;
    quantity: number;
    foodProductName: string;
    foodProductPrice: number;
}
export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}