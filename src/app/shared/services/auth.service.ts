import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
import {environment} from "../../../environments/environment";
import {switchMap, tap} from "rxjs/operators";
import {Router} from "@angular/router";

// export interface User {
//   uid: string;
//   email: string;
//   displayName: string;
//   photoURL: string;
//   emailVerified: boolean;
// }

export interface User {
  email: string;
  name: string;
  role: string;
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
    return this.http.post<LoginResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
      {email: form.email, password: form.password, returnSecureToken: true}).pipe(
        tap(response => {
          localStorage.setItem('email', response.email)
          // @ts-ignore
          return this.user$.next(response);
        }),
    );
  }

  logout() {
    this.user$.next(null);
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
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
  // getCurrentUser(): Observable<User> {
  //   return
  // }

  signUp(email: string, name: string, password: string, role: string) {
    this.http.post<LoginResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`,
      {email, password, returnSecureToken: true}).pipe(
    ).subscribe(res => console.log(res))

    return this.http.post(`${environment.fbURL}/users.json`, {email: email, name: name, role: role})
      .pipe(
      )
      // .subscribe(res => console.log(res))
  }
}
