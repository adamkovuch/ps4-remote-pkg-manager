import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PkgTask } from '../../shared/models/pkg-task';

@Injectable({
  providedIn: 'root'
})
export class HomeDataListService {
  dataSourceList$ = new BehaviorSubject<PkgTask[]>([])

  constructor() { }

  add(item: PkgTask) {
    this.dataSourceList$.next([...this.dataSourceList$.getValue(), item]);
  }

  delete(item: PkgTask) {
    const data = this.dataSourceList$.getValue();
    const index = data.findIndex(x => x === item);
    data.splice(index, 1);
    this.dataSourceList$.next([...data]);
  }

  isExists(name: string) {
    return !!this.dataSourceList$.getValue().find(x => x.name === name);
  }
}
