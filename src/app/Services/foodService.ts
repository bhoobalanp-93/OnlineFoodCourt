import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FoodDataService {

    public messageSource = new BehaviorSubject([]);
    public restID = new BehaviorSubject([]);
    public restName = new BehaviorSubject([]);
    public sessionTokken = new BehaviorSubject([]);

    currentMessage = this.messageSource.asObservable();
    restaurantID = this.restID.asObservable();
    restaurantName = this.restName.asObservable();
    curSessionTokken = this.sessionTokken.asObservable();

    public cartchanged = new BehaviorSubject([]);
    cartupdate = this.cartchanged.asObservable();

    constructor(private httpclient: HttpClient) {
    }

    updateItems(OrderProduct, string, number) {
        this.messageSource.next(OrderProduct);
        this.restName.next(string);
        this.restID.next(number);
    }

    updateSessionToken(sessionValue: any) {
        this.sessionTokken.next(sessionValue);
    }

    changedCartValue(value) {
        this.cartchanged.next(value);
        return value;
    }

    UserDetail(userEmail: string): Observable<any> {
        const login_URL = "https://localhost:44384/Api/customers/GetloggedCustomer";
        return this.httpclient.get(login_URL + '/?userEmail=' + userEmail)
    }

    PlaceOrder(orderData: PostOrder): Observable<any> {
        const placeOrder_URL = "https://localhost:44384/Api/FoodOrders/PostFoodOrder";
        return this.httpclient.post(placeOrder_URL, orderData)
    }
}

export class OrderProduct {
    foodProductID: number;
    quantity: number;
    foodProductName: string;
    foodProductPrice: number;
}

export class PostOrder {
    Order_ID: number;
    RestaurantID: number;
    orderCustomerId: number;
    OrderPrice: number;
    paymentMode: string;
};