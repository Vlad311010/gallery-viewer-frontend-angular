import { Component, computed, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { CONSTANTS } from '@app/constants/gallery-constants';
import { ApiUrlsService, AssetBrowserService, AssetGroupResponseModel, DisplayGroupItemResponseModel, DisplayGroupItemResponseModelPagedData, SetGroupCoverRequestModel } from '@contract/index';
import { DisplayError } from '@app/shared/pages/display-error/error-message.component';
import { ItemsGrid, ItemType } from '../items-grid/items-grid.component';
import { GroupGridItem, ItemPreviewGroup } from '../item-preview/item-preview-group/item-preview-group.component';
import { Paginator } from '../paginator/paginator.component';
import { PagedDirective } from '@shared/directives/paged.directive';
import { PageScrollBinds } from '@app/shared/directives/page-scroll-binds.directive';
import { GroupsService } from '@contract/services/groups.service';
import { lastValueFrom } from 'rxjs';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';

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
  private readonly urlsService = inject(ApiUrlsService)
  private readonly queryClient = inject(QueryClient)

  override totalPages = computed(() => this.itemsQuery.data()?.pagesCount);
  override maxButtonsDisplayed = signal(CONSTANTS.PAGINATOR_MAX_BUTTONS_DISPLAYED)
  override maxPreviousPageButtons = signal(CONSTANTS.PAGINATOR_MAX_PREVIOUS_PAGE_BUTTONS);
  
  itemsPerPage = CONSTANTS.ITEMS_PER_ROW * CONSTANTS.ROWS;
  
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

  readonly itemsQuery = injectQuery(() => ({
    queryKey: [
      AssetBrowserService.name, 
      ...this.urlsService.getListGroupQueryKey(this.id()),
      {
        page: this.page()
      }
    ],
    queryFn: () => 
      lastValueFrom(
        this.assetBrowserService.listGroup(
          this.id(),
          this.itemsPerPage * (this.page() - 1),
          this.itemsPerPage
        )
      )
  }));

  readonly groupDetailsQuery = injectQuery(() => ({
    queryKey: [
      GroupsService.name,
      ...this.urlsService.getGroupDetailsQueryKey(this.id()),
    ],
    queryFn: () => 
      lastValueFrom(
        this.groupsService.groupDetails(this.id())
      ),
  }))

  readonly setCoverMutation = injectMutation(() => ({
    mutationFn: (body: SetGroupCoverRequestModel) =>
      lastValueFrom(
        this.groupsService.groupSetCover(
          this.id(),
          body,
          'response'
        )
      ),

    onSuccess: async response => {
      this.queryClient.invalidateQueries({
        queryKey: [
          GroupsService.name,
          ...this.urlsService.getGroupDetailsQueryKey(this.id()),
        ],
      })
    }
  }));

  readonly displayItems = computed(() => {
    const pagedItems = this.itemsQuery.data();
    const groupDetails = this.groupDetailsQuery.data();

    if (!pagedItems || !groupDetails) return null;

    return {
      ...pagedItems,
      items: pagedItems.items.map(x => this.toAssetDetails(x, groupDetails))
    }
  })

  private toAssetDetails(asset: DisplayGroupItemResponseModel, groupDetails: AssetGroupResponseModel) : GroupGridItem{ 
    return {
      id: asset.id,
      type: ItemType.Asset,
      title: asset.title,
      count: asset.count,
      
      isAssetAddRemoveAllowed: groupDetails.isAssetAddRemoveAllowed ?? false,
      position: asset.inGroupPosition ?? -1,
      isCoverAsset: groupDetails.coverAssetPosition == asset.inGroupPosition
    }
  }

  onCoverFlagChange(assetId: number, value: boolean) {
    const body : SetGroupCoverRequestModel = { assetId: assetId };
    this.setCoverMutation.mutate(body);
  }

  onPositionValueChange(event: Event) {
    const input = (event.target as HTMLInputElement)
    console.log(input.value);
  }
  
}




