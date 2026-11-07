import { Component, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CONSTANTS } from '@app/constants/gallery-constants';
import { toRequestState } from '@app/shared/utils/request-state';
import { AssetBrowserService } from '@contract/index';
import { DisplayError } from '@app/shared/pages/display-error/error-message.component';
import { ItemsGrid } from '../items-grid/items-grid.component';
import { ItemPreview } from '../item-preview/item-preview.component';
import { ToGridItem } from '@shared/pipes/to-grid-item';
import { Paginator } from '../paginator/paginator.component';
import { PagedDirective } from '@shared/directives/paged.directive';
import { PageScrollBinds } from '@app/shared/directives/page-scroll-binds.directive';


@Component({
  selector: 'group',
  templateUrl: './group.component.html',
  imports: [DisplayError, ItemsGrid, ItemPreview, ToGridItem, Paginator],
  hostDirectives: [PageScrollBinds]
})
export class Group extends PagedDirective {
  id = input.required<number, string>({ transform: (value) => numberAttribute(value, 1) });

  assetBrowserService = inject(AssetBrowserService);
  
  itemsPerPage = CONSTANTS.ITEMS_PER_ROW * CONSTANTS.ROWS;
  readonly itemsState = toRequestState(
    toObservable(this.page),
    page => this.assetBrowserService.listGroup(
      this.id(),
      this.itemsPerPage * (page - 1),
      this.itemsPerPage
    ),
    {
      errorMessage: 'Failed to load gallery items',
      onLoadStart: () => window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      })
    }
  );

  override totalPages = computed(() => this.itemsState().data?.pagesCount);
  override maxButtonsDisplayed = signal(CONSTANTS.PAGINATOR_MAX_BUTTONS_DISPLAYED)
  override maxPreviousPageButtons = signal(CONSTANTS.PAGINATOR_MAX_PREVIOUS_PAGE_BUTTONS);
}



