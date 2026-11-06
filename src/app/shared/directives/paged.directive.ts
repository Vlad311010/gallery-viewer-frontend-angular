import { computed, Directive, input, output, signal, effect, numberAttribute, Signal, model, inject } from '@angular/core';
import { Router } from '@angular/router';

@Directive()
export abstract class PagedDirective {
  public page = input<number>(1, { transform: (value) => numberAttribute(value, 1) });

  private readonly router = inject(Router);  

  constructor() {
    effect(() => {
      const totalPages = this.totalPages();
      if (this.page() <= 0)
      {
        this.router.navigate([], { 
        queryParams: {
            page: 1
          } 
        }); 
      }
      else if (totalPages && this.page() > totalPages){
        this.router.navigate([], { 
        queryParams: {
            page: totalPages
          } 
        }); 
      }
    })
  }
  
  readonly abstract totalPages: Signal<number | undefined>;
  readonly abstract maxButtonsDisplayed: Signal<number>;
  readonly abstract maxPreviousPageButtons: Signal<number>;

  readonly hasNextPage = computed(
    () => {
      const totalPages = this.totalPages();
      return totalPages != null && this.page() < totalPages;
    } 
  );

  readonly hasPreviousPage = computed(
    () => this.page() > 1
  );
}