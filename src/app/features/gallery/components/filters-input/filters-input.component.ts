import { Component, computed, effect, ElementRef, inject, viewChild } from "@angular/core";
import { TagSearchInputDirective } from "@app/shared/directives/tag-search/tag-search-input.directive";
import { TagSearchSuggestionDirective } from "@app/shared/directives/tag-search/tag-search-suggestion.directive";
import { ToCategoryClassPipe } from "@app/shared/pipes/to-category";
import { TAG_SEARCH_INPUT_BINDINGS, TAG_SEARCH_LI_BINDINGS, TagSearch } from "@app/shared/directives/tag-search/tag-search.directive";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { RandomSeedProviderService } from "@app/shared/services/random-seed-provider.service";



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
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly seedProvider = inject(RandomSeedProviderService);

  private readonly inputElementRef = viewChild<ElementRef<HTMLInputElement>>('tagSearchInput');

  readonly appliedFilters = toSignal(
    this.route.queryParams.pipe(
      map(params => params['filters'] ?? '')
    ),
    { initialValue: '' }
  );

  readonly inputElement = computed(() => this.inputElementRef()?.nativeElement);

  override inputInitialValue() {
    return this.seedFlagExcluding(this.appliedFilters()); // excluding seed flag from search input
  }
  
  override submit(inputValue: string) {
    inputValue = this.requestPreProcessing(inputValue); // setting and generating random:seed if needed
    this.router.navigate(['./'], {
      queryParams: { filters: inputValue },
      relativeTo: this.route
    });
  }

  private requestPreProcessing(requestFilters: string) {
    if (requestFilters.includes(":random") && !requestFilters.includes("seed:")) {
      return requestFilters + ` seed:${this.seedProvider.regenerate()}`;
    }

    return requestFilters;
  }

  private seedFlagExcluding(requestFilters: string) {
    return requestFilters.replaceAll(/seed:(\d+)/g, '');
  }
}