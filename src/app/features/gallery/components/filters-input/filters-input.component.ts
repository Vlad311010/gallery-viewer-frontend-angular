import { Component, computed, ElementRef, inject, viewChild } from "@angular/core";
import { TagSearchInputDirective } from "@app/shared/directives/tag-search/tag-search-input.directive";
import { TagSearchSuggestionDirective } from "@app/shared/directives/tag-search/tag-search-suggestion.directive";
import { ToCategoryClassPipe } from "@app/shared/pipes/to-category";
import { TAG_SEARCH_INPUT_BINDINGS, TAG_SEARCH_LI_BINDINGS, TagSearch } from "@app/shared/directives/tag-search/tag-search.directive";



@Component({
  selector: 'filters-input',
  templateUrl: './filters-input.component.html',
  styleUrl: './filters-input.component.scss',
  imports: [ToCategoryClassPipe, TagSearchInputDirective, TagSearchSuggestionDirective],
  providers: [
    {
      provide: TAG_SEARCH_INPUT_BINDINGS,
      useFactory: () => inject(FiltersInput).inputBindings,
    },
    {
      provide: TAG_SEARCH_LI_BINDINGS,
      useFactory: () => inject(FiltersInput).liBindings,
    }
  ],
})
export class FiltersInput extends TagSearch {
  inputElementRef = viewChild<ElementRef<HTMLInputElement>>('tagSearchInput');
  
  inputElement = computed(() => this.inputElementRef()?.nativeElement);
  
  override submit(inputValue: string) {
    console.log(inputValue);
  }
}