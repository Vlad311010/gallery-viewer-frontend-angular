import { computed, Directive, effect, inject, signal, viewChild, ElementRef, linkedSignal } from '@angular/core';
import { ApiUrlsService, TagsService } from "@contract/index";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";
import CONSTANTS from '@app/constants/gallery-constants';
import INPUT_CONSTANTS from '@app/constants/input-constants';
import TAG_CONSTANTS from '@app/constants/tag-constants';
import { handleInput, Keybind } from '../utils/input-handler';
import { getCurrentWord, replaceCurrentWord } from "@shared/utils/tag-input-helpers";
import { modulo } from '@shared/utils/util-functions';


const MINIMAL_SEARCH_VALUE_LENGTH = 2

@Directive({
  host: {
    '(window:keydown)': 'onKeyDownWindow($event)',
  },
})
export abstract class TagSearch {

  urlsService = inject(ApiUrlsService)
  tagsService = inject(TagsService)

  inputElement = viewChild<ElementRef<HTMLInputElement>>('tagSearchInput');
  suggestionsListElement = viewChild<ElementRef<HTMLUListElement>>('tagSearchSuggestions');

  protected inputValue = signal("")
  protected cursorPosition = signal(0)
  protected readonly selectedSuggestionIndex = linkedSignal<number | null>(
    () => { this.tagSearchQuery.data(); this.isFocused(); return null }); // reseting selection on query or focus state change
  
  private readonly currentTagInput = computed(() => 
    getCurrentWord(this.inputValue(), this.cursorPosition()))

  protected isFocused = signal(false);

  protected showSuggestions = computed(() => 
    this.isFocused() && this.tagSearchQuery.data()
  );

  tagSearchQuery = injectQuery(() => ({
    queryKey: [
      TagsService.name,
      this.urlsService.getSearchTagsQueryKey(),
      { 
        searchValue: this.currentTagInput(),
        take: CONSTANTS.TAG_SEARCH_FETCH_LIMIT
      }
    ],
    queryFn: () =>  
      lastValueFrom(
        this.tagsService.searchTags(this.currentTagInput().value, CONSTANTS.TAG_SEARCH_FETCH_LIMIT)
      ),

    enabled: this.currentTagInput().value.length >= MINIMAL_SEARCH_VALUE_LENGTH
  }));

  constructor() {
    effect(() => {
      // console.log(this.cursorPosition());
      // console.log(this.tagSearchQuery.data());
      // console.log(this.inputValue(), this.cursorPosition(), this.currentTagInput().value);
      // console.log(this.selectedSuggestionIndex());
    })
  }

  abstract submit(inputValue: string) : void;

  private onSelect(event: Event) {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      console.log("ONSelect", target.selectionStart);
      this.cursorPosition.set(target.selectionStart ?? 0);
    }
  }

  private onInputChange(event: Event) {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.inputValue.set(target.value);
    }
  };

  private submitAction() {
    const suggestions = this.tagSearchQuery.data();
    const selecteSuggestionIdx = this.selectedSuggestionIndex();
    if (!suggestions || selecteSuggestionIdx === null) {
      const input = this.inputValue().trim()
      if (input) {
        this.submit(input);
      }

      return;
    }

    const suggestion = suggestions[selecteSuggestionIdx];
    const newValue = replaceCurrentWord(
      this.inputValue(),
      this.currentTagInput(),
      suggestion.name.replaceAll(
        TAG_CONSTANTS.SPACE_CHARACTER,
        TAG_CONSTANTS.TAG_SEPARATOR_CHARACTER,
      )
    )

    this.inputValue.set(newValue.value);
    requestAnimationFrame(() => {
      const inputElement = this.inputElement()?.nativeElement;      
      if (inputElement) {
        inputElement.setSelectionRange(newValue.cursorPosition, newValue.cursorPosition);
      }
    });
  }

  private suggestionsNavigation(direction: number, maxIndex: number) {
    direction = Math.sign(direction);
    if (maxIndex === 0 || direction === 0) {
      return;
    }

    const currentValue = this.selectedSuggestionIndex();
    if (currentValue === null) {
      this.selectedSuggestionIndex.set(direction > 0 ? 0 : maxIndex - 1);
    }
    else {
      this.selectedSuggestionIndex.set(modulo(currentValue + 1 * direction, maxIndex));
    }
  }

  protected onInputFocus() {
    this.isFocused.set(true);
  };

  protected onInputBlur(event: FocusEvent) {
    this.isFocused.set(false);
  };

  protected onMouseOverSuggestion(suggestionIdx: number) {
    this.selectedSuggestionIndex.set(suggestionIdx);
  };

  protected onMouseClickSuggestion(event: PointerEvent) {
    console.log(event.button);
    if (event.button === 0) {
      this.submitAction();
    }
  };

  private readonly suggestionsNextBind = new Keybind(
    [INPUT_CONSTANTS.SCROLL_DOWN_ARROWS],
    () => this.suggestionsNavigation(1, this.tagSearchQuery.data()?.length ?? 0),
    true
  );

  private readonly suggestionsPrevBind = new Keybind(
    [INPUT_CONSTANTS.SCROLL_UP_ARROWS],
    () => this.suggestionsNavigation(-1, this.tagSearchQuery.data()?.length ?? 0),
    true
  );

  private readonly blurBind = new Keybind(
    [INPUT_CONSTANTS.SUGGESTION_NAVIGATION_CANCEL],
    () => this.inputElement()?.nativeElement.blur(),
    true
  );

  private readonly focusBind = new Keybind(
    [INPUT_CONSTANTS.SEARCH_INPUT_FOCUS],
    () => this.inputElement()?.nativeElement.focus(),
  );

  private readonly applySuggestionBind = new Keybind(
    [INPUT_CONSTANTS.SUGGESTION_NAVIGATION_APPLY],
    () => this.submitAction(),
    true
  );

  protected onKeyDownInput(event: KeyboardEvent) {
    handleInput(event, [
      this.suggestionsNextBind, 
      this.suggestionsPrevBind,
      this.blurBind,
      this.applySuggestionBind
    ]);
  }

  private onKeyDownWindow(event: KeyboardEvent) {
    handleInput(event, [this.focusBind]);
  }

}