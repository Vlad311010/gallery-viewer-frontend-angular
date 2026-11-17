import { Component, input, inject, signal, computed, effect } from '@angular/core';
import { AssetBrowserService } from '@contract/services/assetBrowser.service';
import CONSTANTS from '@app/constants/gallery-constants';
import { ApiUrlsService } from '@contract/index';
import { ToGridItemPipe } from '@app/shared/pipes/to-grid-item';
import { DisplayError } from '@app/shared/pages/display-error/error-message.component';
import { PagedDirective } from '@shared/directives/paged.directive';
import { PageScrollBinds } from '@app/shared/directives/page-scroll-binds.directive';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { Paginator } from '@app/shared/components';
import { ItemPreview, ItemsGrid, NavigationBar } from '@app/features/gallery/components';
import { LinkShortcutBinds } from '@app/shared/directives/link-shortcut-binds.directive';


@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  imports: [ItemPreview, ItemsGrid, ToGridItemPipe, Paginator, DisplayError, NavigationBar, LinkShortcutBinds],
  hostDirectives: [PageScrollBinds]
})
export class Gallery extends PagedDirective {
  galleryName = input.required<string>();
  filters = input<string>();
  
  private readonly assetBrowserService = inject(AssetBrowserService);
  private readonly urlsService = inject(ApiUrlsService);  

  totalPages = computed(() => this.itemsQuery.data()?.pagesCount);
  maxButtonsDisplayed = signal(CONSTANTS.PAGINATOR_MAX_BUTTONS_DISPLAYED)
  maxPreviousPageButtons = signal(CONSTANTS.PAGINATOR_MAX_PREVIOUS_PAGE_BUTTONS);
  
  itemsPerPage = CONSTANTS.ITEMS_PER_ROW * CONSTANTS.ROWS;
  
  private readonly itemsQuery = injectQuery(() => ({
    queryKey: [
      AssetBrowserService.name,
      ...this.urlsService.getListItemsQueryKey(this.galleryName()),
      {
        filter: this.filters(),
        page: this.page()
      }
    ],
    queryFn: () => 
      lastValueFrom(
        this.assetBrowserService.listItems(
          this.galleryName(),
          this.filters(),
          this.itemsPerPage * (this.page() - 1),
          this.itemsPerPage 
        )
      ),
    refetchOnWindowFocus: false
  }))

  constructor() {
    super();

    effect(() => {
      const updatedAt = this.itemsQuery.dataUpdatedAt();
      if (updatedAt != 0) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      }
    });
  }
}