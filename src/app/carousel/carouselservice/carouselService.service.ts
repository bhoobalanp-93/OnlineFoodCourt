
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class CarouselserviceService {

    constructor(private httpRestaurant: HttpClient) { }


    public getRestaurants(): Observable<any> {
        const _RestauarantURL = "https://localhost:44384/Api/FoodOrders/GetRestaurants";
        const _RestauarantURLIIS = "http://localhost:8080/Api/FoodOrders/GetRestaurants";
        return this.httpRestaurant.get(_RestauarantURLIIS);
    }

    public getFoodProducts(restaurantID: number): Observable<any> {
        const _foodProductsParam = new HttpParams().set('id', restaurantID.toString());
        const _foodProductsURL = "https://localhost:44384/Api/FoodOrders/GetFoodProduct";
        const _foodProductsURLIIS = "http://localhost:8080/Api/FoodOrders/GetFoodProduct";
        console.log(this.httpRestaurant.get(_foodProductsURL, { params: _foodProductsParam }));
        return this.httpRestaurant.get(_foodProductsURLIIS, { params: _foodProductsParam });
    }

    public deleteRestaurant(restaurantID: number): Observable<any> {
        const _restaurantParam = new HttpParams().set('id', restaurantID.toString());
        const _DeleteRestURL = "https://localhost:44384/Api/FoodOrders/DeleteRestaurant";
        const _DeleteRestURLIIS = "http://localhost:8080/Api/FoodOrders/DeleteRestaurant";
        return this.httpRestaurant.delete(_DeleteRestURLIIS, { params: _restaurantParam });
    }

}