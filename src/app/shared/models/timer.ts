import {Observable} from "rxjs";

export interface Timer {
  [id: number]: {
    date: Date,
    reservedTime: number,
    isShown: boolean,
    timer$: Observable<any>
  }
}
