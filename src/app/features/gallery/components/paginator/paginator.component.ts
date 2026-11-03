import { NgTemplateOutlet } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { RouterLink, ɵEmptyOutletComponent } from "@angular/router";

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
})
export class Paginator {
  model = input.required<PaginatorProps>();
  
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
        isActive: index === currentPage,
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

    console.log(buttons, currentPage, currentPage === 15, this.model().currentPage);
    return buttons;
  })

  Clamp(value:number, min:number, max:number) {
    return Math.min(Math.max(value, min), max);
  };
}
