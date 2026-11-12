import { Component, input, inject, signal, computed, effect } from '@angular/core';
import { AssetBrowserService } from '@contract/services/assetBrowser.service';
import { CONSTANTS } from '@app/constants/gallery-constants';
import { ApiUrlsService } from '@contract/index';
import { ToGridItem } from '@app/shared/pipes/to-grid-item';
import { DisplayError } from '@app/shared/pages/display-error/error-message.component';
import { PagedDirective } from '@shared/directives/paged.directive';
import { PageScrollBinds } from '@app/shared/directives/page-scroll-binds.directive';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { Paginator } from '@app/shared/components';
import { ItemPreview, ItemsGrid, NavigationBar } from '@app/features/gallery/components';


@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  imports: [ItemPreview, ItemsGrid, ToGridItem, Paginator, DisplayError, NavigationBar],
  hostDirectives: [PageScrollBinds],
})
export class Gallery extends PagedDirective {
  galleryName = input.required<string>();
  
  assetBrowserService = inject(AssetBrowserService);
  urlsService = inject(ApiUrlsService);
  
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  totalPages = computed(() => this.itemsQuery.data()?.pagesCount);
  maxButtonsDisplayed = signal(CONSTANTS.PAGINATOR_MAX_BUTTONS_DISPLAYED)
  maxPreviousPageButtons = signal(CONSTANTS.PAGINATOR_MAX_PREVIOUS_PAGE_BUTTONS);
  
  itemsPerPage = CONSTANTS.ITEMS_PER_ROW * CONSTANTS.ROWS;
  
  private readonly itemsQuery = injectQuery(() => ({
    queryKey: [
      AssetBrowserService.name,
      ...this.urlsService.getListItemsQueryKey(this.galleryName()),
      {
        filter: '',
        page: this.page()
      }
    ],
    queryFn: () => 
      lastValueFrom(
        this.assetBrowserService.listItems(
          this.galleryName(),
          '',
          this.itemsPerPage * (this.page() - 1),
          this.itemsPerPage 
        )
      ),
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