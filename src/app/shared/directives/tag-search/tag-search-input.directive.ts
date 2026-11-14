import { Directive, inject } from "@angular/core";
import { TAG_SEARCH_INPUT_BINDINGS } from "./tag-search.directive";

@Directive({
  selector: 'input[tagSearchInputBehavior]',
  standalone: true,
  host: {
    '[value]': 'binds.inputValue()',
    '(input)': 'binds.onInputChange($event)',
    '(selectionchange)': 'binds.onSelect($event)',
    '(focus)': 'binds.onFocus()',
    '(blur)': 'binds.onBlur($event)',
    '(keydown)': 'binds.onKeyDown($event)',
  }
})
export class TagSearchInputDirective {
  readonly binds = inject(TAG_SEARCH_INPUT_BINDINGS);
}