import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, delay, map, Observable, of, ReplaySubject, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Ps4RemoteService {
  readonly connected$ = new BehaviorSubject(false);

  get ip() {
    return this._ip;
  }

  private _ip: string;

  constructor(private http: HttpClient) {
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
    return this.http.post(`http://${ip}:12800/api/is_exists`, {title_id: 'CUSA09311' }).pipe(
      map(() => true),
      timeout(5000),
      catchError(() => of(false)),
    );
  }

  install(urls: string[]) {
    return this.http.post<any>(`http://${this._ip}:12800/api/install`, {
      type: 'direct',
      packages: urls,
    }).pipe(
      map(response => response.status === 'success'),
      timeout(5000),
    );
  }
}
