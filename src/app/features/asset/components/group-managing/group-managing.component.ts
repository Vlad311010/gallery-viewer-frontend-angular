import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { ApiUrlsService, AssetsService, GroupsService, GalleryService, GroupInfoResponseModel, GroupAddAssetRequestModel } from '@contract/index';
import { lastValueFrom } from 'rxjs';
import { NgxToastService } from 'ngx-toastf';
import { toastDefaultOptions } from '@app/shared/utils/toasts-hepler';
import { DropdownSelectorComponent, SelectOption } from '@app/shared/components/dropdown-selector/dropdown-selector.component';

@Component({
  selector: 'group-managing',
  templateUrl: './group-managing.component.html',
  styleUrl: './group-managing.component.scss',
  imports: [DropdownSelectorComponent]
})
export class GroupManaging {
  assetId = input.required<number>();
  assetGroupId = input.required<number | undefined | null>();
  galleryId = input.required<number>();
  
  private readonly urlsService = inject(ApiUrlsService)
  private readonly groupsService = inject(GroupsService);
  private readonly galleriesService = inject(GalleryService);
  private readonly toastService = inject(NgxToastService);
  private readonly queryClient = inject(QueryClient);
  
  selectedGroupId = signal<number | null>(null);

  dropDownOptions = computed(() => {
    const groupDetails = this.assetGroupDetailsQuery.data();
    const queryData = this.groupsQuery.data();    
    if (groupDetails && !groupDetails.isAssetAddRemoveAllowed) { 
      return new Map([[groupDetails.id, { leftLabel: groupDetails.id.toString(), label: groupDetails.title } as SelectOption]]);
    }
    else if (queryData) {
      return new Map( 
        queryData.map(group => [group.id, this.toDropdownOption(group)]
      ))
    }

    return undefined;
  });

  constructor() {
    effect(() => {
      const assetGroupId = this.assetGroupDetailsQuery.data()?.id;
      if (assetGroupId != undefined) {
        this.selectedGroupId.set(assetGroupId);
      }
    })
  }

  private readonly groupsQuery = injectQuery(() => {
    return {
      queryKey: [
        GalleryService.name,
        ...this.urlsService.getGroupsListQueryKey(this.galleryId())
      ],
      queryFn: () => {
        return lastValueFrom(this.galleriesService.groupsList(this.galleryId()));
      }
    };
  })

  private readonly assetGroupDetailsQuery = injectQuery(() => {
    const groupId = this.assetGroupId();
    return {
      queryKey: [
        GroupsService.name,
        ...this.urlsService.getGroupDetailsQueryKey(groupId!)
      ],
      queryFn: () => {
        return lastValueFrom(this.groupsService.groupDetails(groupId!));
      },
      enabled: () => groupId != null
    };
  })

  readonly attachToGroupMutator = injectMutation(() => ({
    mutationFn: (body: GroupAddAssetRequestModel) =>
      lastValueFrom(
        this.groupsService.groupAddAsset(
          body,
          'response'
        )
      ),

    onSuccess: async () => {
      this.toastService.showToastSuccess('', 
        toastDefaultOptions({ title: "Done" })
      );

      await Promise.all([
        this.queryClient.invalidateQueries({
          queryKey: [
            AssetsService.name,
            ...this.urlsService.getAssetInfoQueryKey(this.assetId())
          ],
        }),

        this.queryClient.invalidateQueries({
          queryKey: [
            GroupsService.name,
            ...this.urlsService.getGroupDetailsQueryKey(this.selectedGroupId()!)
          ],
        })
      ]);
    },
    
    onError: () => {
      this.toastService.showToastError('', 
        toastDefaultOptions({ title: "failed to attach asset to group" })
      );
    }
  }));

  onGroupSelect(groupId: number) {
    this.selectedGroupId.set(groupId);
  }

  onGroupAttach() {
    const groupId = this.selectedGroupId();
    if (groupId) {
      this.attachToGroupMutator.mutate({assetId: this.assetId(), groupId: groupId});
    }
  }

  private toDropdownOption(group : GroupInfoResponseModel) : SelectOption {
    if (group.title) {
      return {leftLabel: group.id.toString(), label: group.title, rightLabel: group.assetsCount.toString()}
    }
    return {label: `ID: ${group.id}`, rightLabel: group.assetsCount.toString()};
  }
}


