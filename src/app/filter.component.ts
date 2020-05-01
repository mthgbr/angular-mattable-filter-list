import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

export class Filters {

  constructor(
    private list: Array<FilterObject> = [],
    private state: 'update' | 'complete' = 'complete'
  ) {}

  /**
   * Update FilterObject & set next value to come
   */
  updateObjectIndex(index: number, field: string, value: string) {
    if (this.list[index]) {
      this.list[index][field] = value;
    } else {
      switch(field) {
        case 'col': this.list.push(new FilterObject(null, value)); break;
        case 'value': this.list.push(new FilterObject(value)); break;
      }
    }
    if (field === 'value') { this.state = 'complete' }
  }
}

export class FilterObject {
  constructor(
    private value: string,
    private col?: string,
    private operator?: string
  ) {}
}

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styles: ['./filter.component.css']
})

export class FilterComponent  {
  @Input() data: any;
  @Output() filters: EventEmitter<Filters> = new EventEmitter<Filters>();

  private filterList: Filters = new Filters();
  /** template filter */
  private formControl = new FormControl();
  private formAutocomplete: string[] = [];
  /** component inner state */
  private ctx = { index: null, field: null, autocompleteRef: [] };

  constructor() {
    /** observe formControl changes */
    this.formControl.valueChanges.subscribe(inputValue => {
      /** reduce formAutocomplete options */
      this.reduceAutocompleteOptions(inputValue);
      /** on match formAutocomplete value */
      if (this.formAutocomplete.lastIndexOf(inputValue) >= 0) {
        this.filterList.updateObjectIndex(this.ctx.index, this.ctx.field, inputValue);
      }
    });
  }

  ngOnInit() {
    
  }

  reduceAutocompleteOptions(value: string) {
    this.formAutocomplete = value
      ? this.ctx.autocompleteRef.filter(
        option => option.trim().toLowerCase().indexOf(value.trim().toLowerCase()) === 0
      )
      : this.ctx.autocompleteRef;
  }
}
