import { NgTemplateOutlet } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { INPUTS } from "@app/constants/input-constants";
import { handleInput, Keybind } from "@app/shared/utils/input-handler";

interface PaginatorProps {
    currentPage: number;

    maxPreviousPageButtons: number;
    maxButtonsDisplayed: number;

    totalPages: number;
    
    displayMoveButtons?: boolean;
    displayJumpButtons?: boolean;
}

interface PaginatorElement {
  page: number,
  symbol: string,
  isActive: boolean
}

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  imports: [NgTemplateOutlet, RouterLink],
  host: {
    '(window:keydown)': 'onKeyDown($event)'
  }
})
export class Paginator {
  model = input.required<PaginatorProps>();
  
  private readonly router = inject(Router);  

  paginatorButtons = computed(() => {
    const currentPage = this.model().currentPage;
    const maxButtonsDisplayed = this.model().maxButtonsDisplayed;
    const totalPages = this.model().totalPages;
    const maxPreviousPageButtons = this.model().maxPreviousPageButtons;
    const buttons : PaginatorElement[] = [];

   

    let startElement = this.Clamp(currentPage - maxPreviousPageButtons, 1, totalPages);
    const endElement = this.Clamp(startElement + maxButtonsDisplayed - 1, 1, totalPages);

    const elementCount = endElement - startElement + 1;
    if (elementCount < maxButtonsDisplayed) {
      startElement = this.Clamp(
        startElement - (maxButtonsDisplayed - elementCount),
        1,
        totalPages
      );
    }

    buttons.push({
      page: 1, 
      symbol: "«", 
      isActive: false,
    }); 

    buttons.push({
      page: this.Clamp(currentPage-1, 1, totalPages), 
      symbol: "‹", 
      isActive: false,
    }); 

    for (let index = startElement; index <= endElement; index++) {
      buttons.push({
        page: index, 
        symbol: index.toString(), 
        isActive: index == currentPage,
      });   
    }

    buttons.push({
      page: this.Clamp(currentPage+1, 1, totalPages), 
      symbol: "›", 
      isActive: false,
    }); 

    buttons.push({
      page: totalPages,
      symbol: "»", 
      isActive: false,
    }); 

    return buttons;
  })

  Clamp(value:number, min:number, max:number) {
    return Math.min(Math.max(value, min), max);
  };

  next() {    
    this.router.navigate([], { 
      queryParams: {
         page: this.Clamp(this.model().currentPage + 1, 1, this.model().totalPages) 
        } 
      });
  }

  previous() {
    this.router.navigate([], {
      queryParams: {
         page: this.Clamp(this.model().currentPage - 1, 1, this.model().totalPages) 
        } 
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    const prevPageBind : Keybind = new Keybind( 
      [INPUTS.PREV_PAGE_WASD, INPUTS.PREV_PAGE_ARROWS],
      () => this.previous(),
    )
    const nextPageBind : Keybind = new Keybind(
      [INPUTS.NEXT_PAGE_WASD, INPUTS.NEXT_PAGE_ARROWS],
      () => this.next(),
    ) 
    
    handleInput(event, [prevPageBind, nextPageBind]);
  }
}

