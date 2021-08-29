import {Observable} from "rxjs";

export interface Timer {
  [id: number]: {
    reservedTime: number,
    isShown: boolean,
    timer$: Observable<any>
  }
}
