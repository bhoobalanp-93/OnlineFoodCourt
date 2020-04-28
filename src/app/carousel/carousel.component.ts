import { Component, OnInit, ViewChild, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CarouselserviceService } from './carouselservice/carouselService.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { FoodcartComponent } from '../cart/FoodCart.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { FoodDataService } from '../Services/foodService';
import { LoginService } from '../loginService';


@Component({
    selector: 'carousel-component',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.css'],
    // encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})


export class CarouselComponent implements OnInit {

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    @Input() count: number;
    @Output() countChanged: EventEmitter<number> = new EventEmitter();

    userDetails: any;
    adminAction = false;
    f_RestaurantPanel: boolean = true;
    f_foodItemPanel: boolean = false;
    cartItemBool: boolean = true;

    resaurantNameSel: string;
    resaurantImageSel: string;
    resaurantRatingSel: any;

    displayedColumnsRest = ['imageUrl', 'restaurantName', 'rest_Contactno', 'rest_DeliveryTime', 'rest_Rating', 'Delete'];
    displayedColumnsFood = ['PimageUrl', 'foodItemName', 'foodItemPrice', 'foodItemAdd'];

    lstResautants: MatTableDataSource<Restaurant>;
    lstFoodProducts: MatTableDataSource<FoodProduct>;
    cartItem: OrderProduct[] = [];
    orderedRestaurant: OrderProduct[] = [];
    orderItem: OrderProduct[] = [];
    selRestaurant = new Restaurant();
    orderedRestaurantID = new Restaurant();
    //orderedRestaurant = new Restaurant();
    searchRestaurant: string = '';
    itemCount: number = 0;
    resultsLength = 0;

    constructor(private _carouselserviceservice: CarouselserviceService,
        iconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer,
        private dialog: MatDialog,
        private foodItemData: FoodDataService,
        private loggedUser: LoginService) {
        iconRegistry.addSvgIcon('Add', sanitizer.bypassSecurityTrustResourceUrl('assets/Icons/plus.svg'));
        iconRegistry.addSvgIcon('Remove', sanitizer.bypassSecurityTrustResourceUrl('assets/Icons/minus.svg'));
        const recievedToken = localStorage.getItem("Token");
        if (recievedToken != null) {
            this.loggedUser.setToken(recievedToken);
            this.userDetails = this.loggedUser.getToken();
            if (this.userDetails.role == "user") {
                this.adminAction = false;
                this.checkIfAdmin();
            }
            else {
                this.adminAction = true;
                this.checkIfAdmin();
            }
        }
        if (this.userDetails == undefined) {
            this.adminAction = false;
            this.checkIfAdmin();
        }
    }


    checkIfAdmin() {
        this.displayedColumnsRest = this.adminAction ? this.displayedColumnsRest : this.displayedColumnsRest.filter(column => column !== 'Delete');
    }
    ngOnInit() {
        this._carouselserviceservice.getRestaurants()
            .subscribe(
                data => {
                    this.lstResautants = new MatTableDataSource(data);
                    this.lstResautants.paginator = this.paginator;
                    this.resultsLength = data.length;
                }
            );
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;

        if (this.lstResautants != null && this.f_foodItemPanel == false) {
            this.lstResautants.filter = filterValue.trim().toLowerCase();
            this.lstResautants.paginator = this.paginator;
            this.lstResautants.sort = this.sort;
        }
        else {
            this.lstFoodProducts.filter = filterValue.trim().toLowerCase();
            this.lstFoodProducts.paginator = this.paginator;
            this.lstFoodProducts.sort = this.sort;
        }
    }

    displayFoodItems(restaurant: Restaurant) {
        var restaurantTID = restaurant.restaurantType_id;
        if (restaurant.restaurantId != this.orderedRestaurantID.restaurantId) {
            this._carouselserviceservice.getFoodProducts(restaurantTID)
                .subscribe(data => {
                    this.lstFoodProducts = new MatTableDataSource(data);
                    this.lstFoodProducts.paginator = this.paginator;
                    this.lstFoodProducts.sort = this.sort;
                    this.cartItem = [];
                    data.map((item) => {
                        if (this.cartItem.length < data.length)
                            this.cartItem.push({ foodProductID: item.foodProductID, quantity: 0, foodProductImage: item.foodProductImage, foodProductName: item.foodProductName, foodProductPrice: item.foodProductPrice })
                    });
                    console.log(this.cartItem);
                    console.log(this.lstFoodProducts);
                })
            this.selRestaurant = restaurant;
            this.resaurantNameSel = this.selRestaurant.restaurantName;
            this.resaurantImageSel = this.selRestaurant.rest_image;
            this.resaurantRatingSel = this.selRestaurant.rest_Rating;
            this.f_RestaurantPanel = false;
            this.f_foodItemPanel = true;
        }
        else {
            this._carouselserviceservice.getFoodProducts(restaurantTID)
                .subscribe(data => {
                    this.lstFoodProducts = new MatTableDataSource(data);
                    this.lstFoodProducts.paginator = this.paginator;
                    this.lstFoodProducts.sort = this.sort;
                    this.cartItem = [];
                    this.cartItem = this.orderedRestaurant;
                })
            this.resaurantNameSel = this.orderedRestaurantID.restaurantName;
            this.resaurantImageSel = this.orderedRestaurantID.rest_image;
            this.resaurantRatingSel = this.orderedRestaurantID.rest_Rating;
            this.f_RestaurantPanel = false;
            this.f_foodItemPanel = true;
        }
    }

    onAddFoodItem(foodProduct: OrderProduct) {
        this.cartItem.map((item) => {
            if (item.foodProductID == foodProduct.foodProductID) {
                item.quantity = item.quantity + 1;
            }
        });
        this.orderItem = this.cartItem.filter(function (obj) {
            return obj.quantity != 0;
        });
        this.count = this.orderItem.length;
        this.countChanged.emit(this.count);
        this.foodItemData.updateItems(this.orderItem, this.selRestaurant.restaurantName, this.selRestaurant.restaurantId);
    }

    onRemoveFoodItem(foodProduct: OrderProduct) {
        this.cartItem.map((item) => {
            if (item.foodProductID == foodProduct.foodProductID) {
                if (item.quantity > 0)
                    item.quantity = item.quantity - 1
            }
        });
        this.orderItem = this.cartItem.filter(function (obj) {
            return obj.quantity != 0;
        });
        this.count = this.orderItem.length;
        this.countChanged.emit(this.count);
        this.foodItemData.updateItems(this.orderItem, this.selRestaurant.restaurantName, this.selRestaurant.restaurantId);
    }
    finishEdit() {
        this.foodItemData.updateItems(this.orderItem, this.selRestaurant.restaurantName, this.selRestaurant.restaurantId);
        this.f_RestaurantPanel = true;
        this.f_foodItemPanel = false;
        this.showCart();
        this.orderedRestaurant = this.cartItem;
        this.orderedRestaurantID = this.selRestaurant;
        //this.cartItem = [];
    }
    cancelEdit() {
        this.f_RestaurantPanel = true;
        this.f_foodItemPanel = false;
        //this.cartItem = [];
    }
    showCart() {
        const cartDialogConfig = new MatDialogConfig();
        cartDialogConfig.disableClose = true;
        cartDialogConfig.autoFocus = false;
        cartDialogConfig.width = "35%";
        cartDialogConfig.height = "50%";
        this.dialog.open(FoodcartComponent, cartDialogConfig);
    }

    onDelete(restaurantID: number) {
        this._carouselserviceservice.deleteRestaurant(restaurantID)
            .subscribe(data => {
                console.log(data)
                window.location.reload();
            });
    }
}


export class Restaurant {
    restaurantId: number;
    restaurantName: string;
    rest_MailID: string;
    rest_Contactno: string;
    rest_Website: string;
    rest_loaction: string;
    rest_Address: string;
    rest_DeliveryTime: string;
    rest_Rating: string;
    rest_image: string;
    restaurantType_id: number;
    RestaurantType: null;
}

export class FoodProduct {
    foodProductID: number;
    foodProductName: string;
    foodProductPrice: number;
    foodProductImage: string;
    fProductCatId: number;
}

export class OrderProduct {
    foodProductID: number;
    quantity: number;
    foodProductImage: string;
    foodProductName: string;
    foodProductPrice: number;
}