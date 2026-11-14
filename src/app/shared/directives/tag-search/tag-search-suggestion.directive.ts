import { Directive, inject, input } from "@angular/core";
import { TAG_SEARCH_LI_BINDINGS } from "./tag-search.directive";

@Directive({
  selector: 'li[tagSearchLiBehavior]',
  standalone: true,
  host: {
    '(mousedown)':'$event.preventDefault()',
    '(mouseover)':'binds.onMouseOver(index())',
    '(click)':'binds.onMouseClick($event)'
  }
})
export class TagSearchSuggestionDirective {
  readonly index = input.required<number>();
  readonly binds = inject(TAG_SEARCH_LI_BINDINGS);
}