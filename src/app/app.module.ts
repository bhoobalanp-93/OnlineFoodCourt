import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MaterialModule } from './SharedModule/Angularmaterial.module';

import { AppComponent } from './app.component';
import { NewuserComponent } from './UserCreation/NewUser.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserserviceService } from './UserCreation/UserServices/UserService.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginService } from './loginService';
import { UserloginComponent } from './UserLogin/UserLogin.component';
import { UserloginService } from './UserLogin/UserLoginServices/userlogin.service';
import { CarouselComponent } from './carousel/carousel.component';
import { CarouselserviceService } from './carousel/carouselservice/carouselService.service';
import { SearchFilterPipe } from './carousel/SearchFilterPipe';
import { FoodcartComponent } from './cart/FoodCart.component';
import { FoodDataService } from './Services/foodService';
import { AppRoutingModule } from './app-routing.module';

@NgModule({

  declarations: [
    FoodcartComponent,
    CarouselComponent,
    UserloginComponent,
    NewuserComponent,
    AppComponent,
    SearchFilterPipe
  ],
  imports: [
    BrowserModule,
    MatGridListModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],


  providers: [
    CarouselserviceService,
    FoodDataService,
    LoginService,
    AppRoutingModule,
    UserloginService, UserserviceService, {
      provide: MatDialogRef,
      useValue: {}
    }],
  bootstrap: [AppComponent],
  entryComponents: [NewuserComponent, UserloginComponent, FoodcartComponent]
})

export class AppModule { }


