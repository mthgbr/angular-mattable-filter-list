import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Filters } from './filter.component';

export interface MatData {
  name: string;
  age: number;
  city: string;
}

const MAT_DATA: MatData[] = [
  {name: 'Mathieu', age: 29, city: 'Toulouse'},
  {name: 'Grégoire', age: 59, city: 'Limoge'},
  {name: 'Jean-Louis', age: 2, city: 'Paris'}
];

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  dataSource = new MatTableDataSource<MatData>();
  displayedColumns = [];

  constructor() {
    this.dataSource.data = MAT_DATA;
    this.displayedColumns = Object.keys(MAT_DATA[0]);
  }

  applyFilter(filters: Filters) {
    /** trigger default behaviour for filtering MatTableDataSource's data */
    this.dataSource.filter = filters;
  }
}
