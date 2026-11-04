import { Component, input, inject, signal, OnInit, numberAttribute, Signal } from '@angular/core';
import { ItemPreview } from "../item-preview/item-preview.component";
import { ItemsGrid } from '../items-grid/items-grid.component';
import { AssetBrowserService } from '@contract/services/assetBrowser.service';
import { CONSTANTS } from '@app/constants/gallery-constants';
import { DisplayItemResponseModelPagedData } from '@contract/index';
import { ToGridItem } from '@app/shared/pipes/to-grid-item';
import { Paginator } from '../paginator/paginator.component';
import { toObservable } from '@angular/core/rxjs-interop';
import { RequestState, toRequestState } from '@app/shared/utils/request-state';
import { DisplayError } from '@app/shared/pages/display-error/error-message.component';


@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  imports: [ItemPreview, ItemsGrid, ToGridItem, Paginator, DisplayError]
})
export class GalleryList {
  galleryName = input.required<string>();
  page = input<number>(1, { transform: (value) => numberAttribute(value, 1) });
  
  itemsPerPage = CONSTANTS.ITEMS_PER_ROW * CONSTANTS.ROWS;
  
  assetBrowserService = inject(AssetBrowserService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly itemsState: Signal<RequestState<DisplayItemResponseModelPagedData>> = toRequestState(
    toObservable(this.page),
    page => this.assetBrowserService.listItems(
      this.galleryName(),
      '',
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
}