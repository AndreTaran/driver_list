import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService, User} from "./auth.service";
import {map, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AngularFireDatabase} from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private db: AngularFireDatabase
  ) {}



  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return this.authService.getCurrentUser().pipe(
    //   // map(user => !!user),
    //   tap(() => {
    //     const user = {
    //       email: localStorage.getItem('email')
    //     }
    //     console.log('sasat', user)
    //     if (!user.email) {
    //       console.log('huy')
    //       this.router.navigateByUrl('/login');
    //     } else {
    //       const userRef = this.db.database.ref().child('users');
    //       userRef.orderByChild('user_email').equalTo(user.email).once('value', snap => {
    //         console.log(snap.val(), 'sasat')
    //         // @ts-ignore
    //         const user: User = Object.values(snap.val())[0];
    //         localStorage.setItem('role', user.role);
    //         localStorage.setItem('name', user.name);
    //       })
    //     }
    //   }),
    //   map(user => !!user),
    // );
    const user = {
      email: localStorage.getItem('email')
    }

    if (!user.email) {
      console.log('huy')
      this.router.navigateByUrl('/login');
      return false;
    } else {
      const userRef = this.db.database.ref().child('users');
      userRef.orderByChild('email').equalTo(user.email).once('value', snap => {
        console.log(snap.val(), 'sasatiiiiii')
        // @ts-ignore
        const user: User = Object.values(snap.val())[0];
        console.log(user, 'current user')
        localStorage.setItem('role', user.role);
        localStorage.setItem('name', user.name);

      }).then(res => console.log(res))
      return true;

    }
  }
}
