import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewuserComponent } from './UserCreation/NewUser.component';
import { UserserviceService } from './UserCreation/UserServices/UserService.service';
import { UserloginService } from './UserLogin/UserLoginServices/userlogin.service';
import { UserloginComponent } from './UserLogin/UserLogin.component';
import { FoodcartComponent } from './cart/FoodCart.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginService } from './loginService';
import { FoodDataService } from './Services/foodService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {

  userDetails: any;
  mySubscription: any;

  ngOnInit() {
    console.log("test");
    const recievedToken = localStorage.getItem("Token");
    if (recievedToken != null)
      this.loggedUser.setToken(recievedToken);
    this.userDetails = this.loggedUser.getToken();
    console.log(this.userDetails);
  }

  badgeCounter: any;
  countChangedHandler(count: number) {
    this.badgeCounter = count;
  }

  constructor(private dialog: MatDialog, private service: UserserviceService,
    private loginservice: UserloginService, iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private loggedUser: LoginService,
    private foodItemData: FoodDataService) {
    iconRegistry.addSvgIcon('Basket', sanitizer.bypassSecurityTrustResourceUrl('assets/Icons/shopping-cart (2).svg'));
    this.foodItemData.cartupdate
      .subscribe((data) => {
        //add your logic here!! for now I'm just gonna console log the sate of the dialog
        this.badgeCounter = data;
      });
  }

  onCreate() {
    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "50%";
    dialogConfig.height = "80%";
    this.dialog.open(NewuserComponent, dialogConfig);
  }

  userLogin() {
    this.loginservice.initializeLoginFormGroup();
    const userdialogConfig = new MatDialogConfig();
    userdialogConfig.disableClose = true;
    userdialogConfig.autoFocus = false;
    userdialogConfig.width = "30%";
    userdialogConfig.height = "40%";
    userdialogConfig.position = { top: '2%' }
    const dialogRef = this.dialog.open(UserloginComponent, userdialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (this.loggedUser.getToken()) {
        this.userDetails = this.loggedUser.getToken();
      }
      window.location.reload();
    });

  }

  onLogout() {
    localStorage.clear();
    localStorage.removeItem("Token");
    this.userDetails = null;
    this.badgeCounter = null;
    this.foodItemData.updateSessionToken("False");
    window.location.reload();
  }
  onHome() {
    window.location.reload();
  }
  showCart() {
    const cartDialogConfig = new MatDialogConfig();
    cartDialogConfig.disableClose = true;
    cartDialogConfig.autoFocus = false;
    cartDialogConfig.position = { "right": "1%", "top": "1%" }
    cartDialogConfig.width = "35%";
    cartDialogConfig.height = "50%";
    cartDialogConfig.panelClass = "custom-dialog-container";
    this.dialog.open(FoodcartComponent, cartDialogConfig);
  }
}
