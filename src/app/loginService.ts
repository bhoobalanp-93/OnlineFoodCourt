import { JwtHelperService } from '@auth0/angular-jwt';

export class LoginService {

    helper = new JwtHelperService();
    token: any;
    decodedToken: any;
    expirationDate: any;
    isExipired: any;

    setToken(recievedToken: any) {
        this.decodedToken = this.helper.decodeToken(recievedToken.toString());
        console.log(this.decodedToken);
        this.token = this.decodedToken;
        this.expirationDate = this.helper.getTokenExpirationDate(recievedToken)
        this.isExipired = !this.helper.isTokenExpired(recievedToken);
        console.log(this.expirationDate)
        console.log(this.isExipired)
        return this.isExipired;

    }
    getToken() {
        if (localStorage.getItem("Token") != null)
            return this.token;
        else
            return false;
    }

    TokenExpiration(recievedToken: any) {
        this.expirationDate = this.helper.getTokenExpirationDate(recievedToken)
        this.isExipired = !this.helper.isTokenExpired(recievedToken);
        return this.isExipired;
    }
}
