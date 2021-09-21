import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
import {environment} from "../../../environments/environment";
import {switchMap, tap} from "rxjs/operators";
import {Router} from "@angular/router";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}

export interface LoginResponse {
  idToken:	string;
  email:	string;
  refreshToken:	string;
  expiresIn:	string;
  localId:	string;
  registered: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient,
              private router: Router) { }

  login(form: {email: string, password: string}): Observable<LoginResponse> {
    console.log(form)
    return this.http.post<LoginResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
      {email: form.email, password: form.password, returnSecureToken: true}).pipe(
        tap(response => {
          console.log(response, 'pasasi')
          // @ts-ignore
          return this.user$.next(response.localId);
        }),
    );
  }

  logout() {
    this.user$.next(null);
    this.router.navigateByUrl('login');
  }

  getCurrentUser(): Observable<User> {
    return this.user$.pipe(
      switchMap(user => {
        if (user) {
          return of(user);
        }

        return of(null);
      })
    )
  }
}
