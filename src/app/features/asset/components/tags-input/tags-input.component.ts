import { Component, computed, ElementRef, inject, viewChild, output } from '@angular/core';
import { TagSearchInputDirective } from "@app/shared/directives/tag-search/tag-search-input.directive";
import { TagSearchSuggestionDirective } from "@app/shared/directives/tag-search/tag-search-suggestion.directive";
import { ToCategoryClassPipe } from "@app/shared/pipes/to-category";
import { TAG_SEARCH_INPUT_BINDINGS, TAG_SEARCH_LI_BINDINGS, TagSearch } from "@app/shared/directives/tag-search/tag-search.directive";


@Component({
  selector: 'tags-input',
  styleUrl: './tags-input.component.scss',
  templateUrl: './tags-input.component.html',
  imports: [ToCategoryClassPipe, TagSearchInputDirective, TagSearchSuggestionDirective],
  providers: [
    {
      provide: TAG_SEARCH_INPUT_BINDINGS,
      useFactory: () => inject(TagsInput).inputBindings,
    },
    {
      provide: TAG_SEARCH_LI_BINDINGS,
      useFactory: () => inject(TagsInput).liBindings,
    }
  ],
})
export class TagsInput extends TagSearch {
  submitCall = output<string>();

  private readonly inputElementRef = viewChild<ElementRef<HTMLInputElement>>('tagsInput');

  readonly inputElement = computed(() => this.inputElementRef()?.nativeElement);

  override submit(inputValue: string) {
    this.submitCall.emit(inputValue);
  }
}