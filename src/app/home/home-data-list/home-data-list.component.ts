import { Component, Input, OnInit } from '@angular/core';
import { PkgTask } from '../../shared/models/pkg-task';

@Component({
  selector: 'app-home-data-list',
  templateUrl: './home-data-list.component.html',
  styleUrls: ['./home-data-list.component.scss']
})
export class HomeDataListComponent implements OnInit {
  @Input()
  dataSource: PkgTask[];

  displayedColumns = [
    "taskid",
    "name",
    "source",
    "progress",
    "link"
  ]
  constructor() { 
    this.dataSource = [];
  }

  ngOnInit(): void {
  }

}
