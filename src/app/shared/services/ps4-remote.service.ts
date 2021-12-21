import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Ps4RemoteService {
  readonly connected$ = new BehaviorSubject(false);

  get ip() {
    return this._ip;
  }

  private _ip: string;

  constructor() {
  }

  connect(ip: string) {
    this._ip = ip;
    this.connected$.next(true);
  }

  disconnect() {
    this._ip = null;
    this.connected$.next(false);
  }

  ping(ip: string) {
    return of(true);
  }
}
