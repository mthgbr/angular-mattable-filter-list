import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

export class Filters {
  constructor(
    private list: Array<FilterObject> = [],
    private state: 'update' | 'complete' = 'complete'
  ) {}

  get filterList() {
    return this.list;
  }

  get filterState() {
    return this.state;
  }

  set filterState(value: 'update' | 'complete') {
    this.state = value;
  }

  /** 
   * Create FilterObject and push to last position in list Array
   * Update state
   * @field: string
   * @value: string
   */
  createObject(field: string, value: string) {
    switch(field) {
      case 'col': this.list.push(new FilterObject(null, value)); break;
      case 'value': this.list.push(new FilterObject(value)); break;
    }

    this.state = field === 'value' && value.length > 0 ? 'complete' : 'update';
  }

  /**
   * Update FilterObject at index or create new FilterObject
   * Update state
   * @param index: number
   * @param field: string
   * @param value: string
   */
  updateObject(index: number, field: string, value: string) {
    if (this.list[index]) {
      this.list[index][field] = value;
    } else {
      this.createObject(field, value);
    }

    this.state = field === 'value' && value.length > 0 ? 'complete' : 'update';
  }

  /** 
   * Remove FilterObject at index
   * @param index: number
   */
  removeObject(index: number) {
    this.list.splice(index, 1);
  }

  /** 
   * Clean all FilterObject
   */
  cleanObjetcs() {
    this.list = [];
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
  /** component inner context */
  private ctx = { index: null, field: null, autocompleteRef: [] };

  constructor() {
    /** observe formControl changes */
    this.formControl.valueChanges.subscribe(inputValue => {
      /** reduce formAutocomplete options */
      this.reduceAutocompleteOptions(inputValue);
      /** on match formAutocomplete value on field 'col' & 'operator' */
      if (this.formAutocomplete.lastIndexOf(inputValue) >= 0) {
        this.filterList.updateObject(this.ctx.index, this.ctx.field, inputValue);
      }
    });
  }

  ngOnInit() {
    /** init inner context */
    this.ctx.index = 0;
    this.ctx.field = 'col';
    this.ctx.autocompleteRef['col'] = Object.keys(this.data);
    this.ctx.autocompleteRef['operator'] = ['=', '!='];
    /** init filter */
    this.filterList.createObject('value', '');
    this.filterList.filterState = 'update';
  }

  /** 
   * Reduce autocomplete options on user's input value
   * @param value: string
   */
  reduceAutocompleteOptions(inputValue: string) {
    this.formAutocomplete = inputValue
      ? this.ctx.autocompleteRef[this.ctx.field].filter(
        option => option.trim().toLowerCase().indexOf(inputValue.trim().toLowerCase()) === 0
      )
      : this.ctx.autocompleteRef;
  }

  /** 
   * Set form autocomplete for selected field
   * @param field: string
   */
  setAutocompleteOptions(field: string) {
    this.formAutocomplete = this.ctx.autocompleteRef[field];
  }

  /** 
   * Confirm filter on ENTER keyup
   * Cancel filter on BACKSPACE keyup
   * Emit update
   * @param $event
   */
  formValidation($event) {
    /** on ENTER keyup do confirm user's input value as filter value field */
    if ($event.keyCode === 13 && this.formControl.value) {
      this.filterList.updateObject(this.ctx.index, 'value', this.formControl.value);
    }
    /** on BACKSPACE keyup do cancel current filter */
    if ($event.keyCode === 8 && !this.formControl.value) {
      // todo
    }

    /** send output filters */
    this.filters.emit(this.filterList);
  }

  /** 
   * Remove filter from list at index
   * Emit update
   * @param index: number
   */
  removeFilterObject(index: number) {
    this.filterList.removeObject(index);

    /** send output filters */
    this.filters.emit(this.filterList);
  }
}
