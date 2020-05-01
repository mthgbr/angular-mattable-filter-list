import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { 
  MatTableModule,
  MatOptionModule,
  MatAutocompleteModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { FilterComponent } from './filter.component';

@NgModule({
  imports:      [ 
    BrowserModule, 
    FormsModule,
    MatTableModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    FilterComponent
  ],
  declarations: [ AppComponent, FilterComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
