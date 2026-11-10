import { Component, computed, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CONSTANTS } from '@app/constants/gallery-constants';
import { toRequestState } from '@app/shared/utils/request-state';
import { AssetBrowserService, AssetPosition, DisplayGroupItemResponseModel, DisplayGroupItemResponseModelPagedData, DisplayItemType, SetGroupCoverRequestModel } from '@contract/index';
import { DisplayError } from '@app/shared/pages/display-error/error-message.component';
import { ItemsGrid, ItemType } from '../items-grid/items-grid.component';
import { GroupGridItem, ItemPreviewGroup } from '../item-preview/item-preview-group/item-preview-group.component';
import { ItemPreview } from '../item-preview/item-preview.component';
import { ToGridItem } from '@shared/pipes/to-grid-item';
import { Paginator } from '../paginator/paginator.component';
import { PagedDirective } from '@shared/directives/paged.directive';
import { PageScrollBinds } from '@app/shared/directives/page-scroll-binds.directive';
import { GroupsService } from '@contract/services/groups.service';
import { lastValueFrom, map } from 'rxjs';
import { injectQuery } from '@tanstack/angular-query-experimental';


@Component({
  selector: 'group',
  templateUrl: './group.component.html',
  imports: [DisplayError, ItemsGrid, ItemPreviewGroup, Paginator],
  hostDirectives: [PageScrollBinds]
})
export class Group extends PagedDirective {
  id = input.required<number, string>({ transform: (value) => numberAttribute(value, 1) });

  private readonly assetBrowserService = inject(AssetBrowserService);
  private readonly groupsService = inject(GroupsService);

  override totalPages = computed(() => this.itemsQuery.data()?.pagesCount);
  override maxButtonsDisplayed = signal(CONSTANTS.PAGINATOR_MAX_BUTTONS_DISPLAYED)
  override maxPreviousPageButtons = signal(CONSTANTS.PAGINATOR_MAX_PREVIOUS_PAGE_BUTTONS);
  
  itemsPerPage = CONSTANTS.ITEMS_PER_ROW * CONSTANTS.ROWS;
  /*private readonly itemsState = toRequestState(
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
  );*/

  readonly itemsQuery = injectQuery(() => ({
    queryKey: ['assetBrowserService', this.id(), this.page()],
    queryFn: () =>
      lastValueFrom(
        this.assetBrowserService.listGroup(
          this.id(),
          this.itemsPerPage * (this.page() - 1),
          this.itemsPerPage
        )
      ),
    select: (response : DisplayGroupItemResponseModelPagedData) => ({
      ...response,
      items: response.items.map(x => this.toAssetDetails(x))
    })
  }));

  readonly groupDetailsQuery = injectQuery(() => ({
    queryKey: ['s'],
    queryFn: () => 
      lastValueFrom(
        this.groupsService.groupDetails(this.id())
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

  private toAssetDetails(asset: DisplayGroupItemResponseModel) : GroupGridItem{ 
    const groupDetailsData = this.groupDetailsQuery.isLoading() ? undefined : this.groupDetailsQuery.data();
    return {
      id: asset.id,
      type: ItemType.Asset,
      title: asset.title,
      count: asset.count,
      
      isAssetAddRemoveAllowed: groupDetailsData?.isAssetAddRemoveAllowed ?? false,
      position: asset.inGroupPosition ?? -1,
      isCoverAsset: !groupDetailsData ? false : groupDetailsData.coverAssetPosition == asset.inGroupPosition
    }
  }

  onCoverFlagChange(assetId: number, value: boolean) {
    if (value) {
      const body : SetGroupCoverRequestModel = { assetId: assetId };
      /*this.groupsService.groupSetCover(this.id(), body, 'response')
      .subscribe(response => {
        console.log(response.status);
      });*/
    }
  }

  onPositionValueChange(event: Event) {
    const input = (event.target as HTMLInputElement)
    console.log(input.value);
  }
  
}




