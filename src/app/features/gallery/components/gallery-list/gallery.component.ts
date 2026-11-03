import { Component, input, inject, signal, OnInit, numberAttribute, Signal } from '@angular/core';
import { ItemPreview } from "../item-preview/item-preview.component";
import { ItemsGrid } from '../items-grid/items-grid.component';
import { AssetBrowserService } from '@contract/services/assetBrowser.service';
import { CONSTANTS } from '@app/constants/gallery-constants';
import { DisplayItemResponseModelPagedData } from '@contract/index';
import { ToGridItem } from '@app/shared/pipes/to-grid-item';
import { Paginator } from '../paginator/paginator.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';

interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  imports: [ItemPreview, ItemsGrid, ToGridItem, Paginator]
})
export class GalleryList {
  galleryName = input.required<string>();
  page = input<number>(1, { transform: (value) => numberAttribute(value, 1) });
  
  itemsPerPage = CONSTANTS.ITEMS_PER_ROW * CONSTANTS.ROWS;
  
  assetBrowserService = inject(AssetBrowserService);

  readonly displayItems = signal<DisplayItemResponseModelPagedData | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly itemsState : Signal<RequestState<DisplayItemResponseModelPagedData>> = toSignal(
    toObservable(this.page).pipe(
      distinctUntilChanged(),
      switchMap(page => {
        
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });
        
        return this.assetBrowserService.listItems(
          this.galleryName(),
          '',
          this.itemsPerPage * (page - 1),
          this.itemsPerPage
        ).pipe(
          map(data => ({
            data,
            loading: false,
            error: null,
          })),
          startWith({
            data: null,
            loading: true,
            error: null
          }),
          catchError(() => of({
            data: null,
            loading: false,
            error: 'Failed to load gallery items'
          }))
        )
      })
    ),
    {
      initialValue: {
        data: null,
        loading: true,
        error: null
      }
    }
  );

}