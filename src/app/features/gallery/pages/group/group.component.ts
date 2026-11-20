import { Component, computed, effect, inject, input, numberAttribute, signal } from '@angular/core';
import CONSTANTS from '@app/constants/gallery-constants';
import { ApiUrlsService, AssetBrowserService, AssetGroupResponseModel, AssetPosition, DisplayGroupItemResponseModel, DisplayGroupItemResponseModelPagedData, GroupRemoveAssetRequestModel, SetAssetPositionsRequestModel, SetGroupCoverRequestModel } from '@contract/index';
import { DisplayError } from '@app/shared/pages/display-error/error-message.component';
import { PagedDirective } from '@shared/directives/paged.directive';
import { PageScrollBinds } from '@app/shared/directives/page-scroll-binds.directive';
import { GroupsService } from '@contract/services/groups.service';
import { lastValueFrom } from 'rxjs';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { ViewStateService } from '@app/shared/services/view-state.service';
import { ItemPreviewGroup, ItemsGrid, ItemType, GroupGridItem } from '@app/features/gallery/components';
import { Paginator } from '@app/shared/components';
import { NgxToastService } from 'ngx-toastf';
import { toastDefaultOptions } from '@app/shared/utils/toasts-hepler';
import { LinkShortcutBinds } from '@app/shared/directives/link-shortcut-binds.directive';

interface PositionData {
  id: number;
  position: number;
}

@Component({
  selector: 'group',
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
  imports: [DisplayError, ItemsGrid, ItemPreviewGroup, Paginator, LinkShortcutBinds],
  hostDirectives: [PageScrollBinds]
})
export class Group extends PagedDirective {
  id = input.required<number, string>({ transform: (value) => numberAttribute(value, 1) });
  returnUrl = input<string>();

  private readonly viewState = inject(ViewStateService)
  private readonly assetBrowserService = inject(AssetBrowserService);
  private readonly groupsService = inject(GroupsService);
  private readonly urlsService = inject(ApiUrlsService)
  private readonly queryClient = inject(QueryClient)
  private readonly toastService = inject(NgxToastService)
   
  override totalPages = computed(() => this.itemsQuery.data()?.pagesCount);
  override maxButtonsDisplayed = signal(CONSTANTS.PAGINATOR_MAX_BUTTONS_DISPLAYED)
  override maxPreviousPageButtons = signal(CONSTANTS.PAGINATOR_MAX_PREVIOUS_PAGE_BUTTONS);
  
  itemsPerPage = CONSTANTS.ITEMS_PER_ROW * CONSTANTS.ROWS;

  positions : PositionData[] = [];
  normalizedPositions : PositionData[] = [];

  readonly displayItems = computed(() => {
    const pagedItems = this.itemsQuery.data();
    const groupDetails = this.groupDetailsQuery.data();

    if (!pagedItems || !groupDetails) return null;

    this.positions = pagedItems.items.map(x => ({id:x.id, position: x.inGroupPosition ?? 0}))
    this.normalizedPositions = this.positions;

    return {
      ...pagedItems,
      items: pagedItems.items.map(x => this.toAssetDetails(x, groupDetails))
    }
  })

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
    refetchOnWindowFocus: false
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

    onSuccess: () => {
      this.toastService.showToastSuccess('', 
        toastDefaultOptions({ title: "cover updated" })
      );

      this.queryClient.invalidateQueries({
        queryKey: [
          GroupsService.name,
          ...this.urlsService.getGroupDetailsQueryKey(this.id()),
        ],
      })
    },
    
    onError: () => {
      this.toastService.showToastError('', 
        toastDefaultOptions({ title: "failed to updated cover" })
      );
    }
  }));

  readonly detachAssetFromGroupMutation = injectMutation(() => ({
    mutationFn: (body: GroupRemoveAssetRequestModel) =>
      lastValueFrom(
        this.groupsService.groupRemoveAsset(
          body,
          'response'
        )
      ),

    onSuccess: () => {
      this.queryClient.invalidateQueries({
        queryKey: [
          AssetBrowserService.name, 
          ...this.urlsService.getListGroupQueryKey(this.id())
        ],
      })
    },
    
    onError: () => {
      this.toastService.showToastError('', 
        toastDefaultOptions({ title: "failed to remove asset" })
      );
    }
  }));

  readonly setPositionsMutation = injectMutation(() => ({
    mutationFn: (body: SetAssetPositionsRequestModel) =>
      lastValueFrom(
        this.groupsService.groupSetPositons(
          this.id(),
          body,
          'response'
        )
      ),

    onSuccess: () => {
      this.queryClient.invalidateQueries({
        queryKey: [
          AssetBrowserService.name, 
          ...this.urlsService.getListGroupQueryKey(this.id()),
        ],
      })
    },
    
    onError: () => {
      this.toastService.showToastError('', 
        toastDefaultOptions({ title: "operation failed" })
      );
    }
  }));

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

  private onCoverFlagChange(assetId: number, value: boolean) {
    const body : SetGroupCoverRequestModel = { assetId: assetId };
    this.setCoverMutation.mutate(body);
  }

  private onPositionValueChange(id: number, value: number) {    
    this.positions = this.positions.map(x => x.id === id ? {...x, position: value}  : x);
    this.normalizedPositions = this.normalizeAssetPositions(this.positions);
  }
  
  private async onPositionsSubmit() {
    const body : SetAssetPositionsRequestModel = { positions: this.normalizedPositions };
    await this.setPositionsMutation.mutateAsync(body);
  }

  private onAssetRemove(assetId: number) {
    this.detachAssetFromGroupMutation.mutate({groupId: this.id(), assetId: assetId});
  }

  private normalizeAssetPositions(positions: PositionData[]) : PositionData[] {
    return positions.sort((a, b) => a.position - b.position).map((x, idx) => ({ id: x.id, position: idx }));
  }
}

