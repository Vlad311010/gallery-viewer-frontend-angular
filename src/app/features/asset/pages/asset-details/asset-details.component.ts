import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { TagsService, ApiUrlsService, AssetsService, TagDtoInfo, MediaService, GroupsService, GalleryService, GroupInfoResponseModel, GroupAddAssetRequestModel, AssetBrowserService } from '@contract/index';
import { lastValueFrom } from 'rxjs';
import { KeyValue, KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { ToCategoryClassPipe } from '@app/shared/pipes/to-category';
import { AssetTagsResponseModel } from '@contract/models/index';
import { IsVideoPipe } from '@shared/pipes/is-video';
import { NgxToastService } from 'ngx-toastf';
import { toastDefaultOptions } from '@app/shared/utils/toasts-hepler';
import { ViewStateService } from '@app/shared/services/view-state.service';
import { TagsInput } from '@app/features/asset/components';
import CONSTANTS from '@app/constants/tag-constants';
import { DropdownSelectorComponent, SelectOption } from '@app/shared/components/dropdown-selector/dropdown-selector.component';


@Component({
  selector: 'asset-details',
  templateUrl: 'asset-details.component.html',
  styleUrl: 'asset-details.component.scss',
  imports: [KeyValuePipe, NgTemplateOutlet, ToCategoryClassPipe, IsVideoPipe, TagsInput, DropdownSelectorComponent]
})
export class AssetDetails {
  assetId = input.required<number>();  
  
  urlsService = inject(ApiUrlsService)
  tagsService = inject(TagsService);
  assetsService = inject(AssetsService);
  mediaService = inject(MediaService);
  groupsService = inject(GroupsService);
  galleriesService = inject(GalleryService);
  toastService = inject(NgxToastService);
  queryClient = inject(QueryClient);
  viewState = inject(ViewStateService);
  
  assetUrl = computed(() => this.urlsService.getAssetUrl(this.assetId()));

  private readonly categoriesOrder = ['author', 'source', 'character', 'general'];
  
  private readonly compareCategories = (a: KeyValue<string, TagDtoInfo[]>, b: KeyValue<string, TagDtoInfo[]>) =>
    this.categoriesOrder.indexOf(a.key) - this.categoriesOrder.indexOf(b.key);

  selectedGroupId = signal<number | null>(null);

  mimeType = computed(() => this.assetMimeTypeQuery.data()?.type);
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

  private readonly tagsQuery = injectQuery(() => ({
    queryKey: [
      AssetsService.name,
      ...this.urlsService.getAssetTagsQueryKey(this.assetId())
    ],
    queryFn: () => {
      return lastValueFrom(this.assetsService.assetTags(this.assetId()));
    },
    select: (tagsData: AssetTagsResponseModel) => {
      return { ...tagsData, 
        tags: Object.fromEntries(
          this.categoriesOrder.map(category => [
            category,
            tagsData.tags[category] ?? []
          ])
        )
      };
    }
  }));

  private readonly assetInfoQuery = injectQuery(() => ({
    queryKey: [
      AssetsService.name,
      ...this.urlsService.getAssetInfoQueryKey(this.assetId())
    ],
    queryFn: () => {
      return lastValueFrom(this.assetsService.assetInfo(this.assetId()));
    }
  }))

  private readonly groupsQuery = injectQuery(() => {
    const galleryId = this.assetInfoQuery.data()?.galleryId;
    return {
      queryKey: [
        GalleryService.name,
        ...this.urlsService.getGroupsListQueryKey(galleryId!)
      ],
      queryFn: () => {
        return lastValueFrom(this.galleriesService.groupsList(galleryId!));
      },
      enabled: () => !this.assetInfoQuery.isLoading() && !this.assetInfoQuery.isError() && galleryId != null
    };
  })

  private readonly assetGroupDetailsQuery = injectQuery(() => {
    const groupId = this.assetInfoQuery.data()?.groupId;
    return {
      queryKey: [
        GroupsService.name,
        ...this.urlsService.getGroupDetailsQueryKey(groupId!)
      ],
      queryFn: () => {
        return lastValueFrom(this.groupsService.groupDetails(groupId!));
      },
      enabled: () => (!this.assetInfoQuery.isLoading() && !this.assetInfoQuery.isError() && groupId != null)
    };
  })

  private readonly assetMimeTypeQuery = injectQuery(() => ({
    queryKey: [
      MediaService.name,
      ...this.urlsService.getAssetTagsQueryKey(this.assetId())
    ],
    queryFn: () => {
      return lastValueFrom(this.mediaService.assetHead(this.assetId()));
    }
  }))

  readonly removeTagMutation = injectMutation(() => ({
    mutationFn: (tag: string) =>
      lastValueFrom(
        this.assetsService.removeAssetTag(
          this.assetId(),
          tag,
          'response'
        )
      ),

    onSuccess: () => {
      this.queryClient.invalidateQueries({
        queryKey: [
          AssetsService.name,
          ...this.urlsService.getAssetTagsQueryKey(this.assetId())
        ],
      })
    },
    
    onError: () => {
      this.toastService.showToastError('', 
        toastDefaultOptions({ title: "failed to remove tag" })
      );
    }
  }));

  readonly addTagsMutation = injectMutation(() => ({
    mutationFn: (tags: string[]) =>
      lastValueFrom(
        this.assetsService.addAssetTags(
          this.assetId(),
          tags,
          'response'
        )
      ),

    onSuccess: () => {
      this.queryClient.invalidateQueries({
        queryKey: [
          AssetsService.name,
          ...this.urlsService.getAssetTagsQueryKey(this.assetId())
        ],
      })
    },
    
    onError: () => {
      this.toastService.showToastError('', 
        toastDefaultOptions({ title: "failed to add tags" })
      );
    }
  }));

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

  private onTagRemove(tag: string) {
    if (window.confirm("Remove?")) {
      this.removeTagMutation.mutate(tag);
    }
  }

  private onAddTagsSubmit(tags: string) {
    tags = tags.trim();
    if (!tags) {
      return;
    }

    if (window.confirm("Submit?")) {
      const tagsToSubmit = tags.split(CONSTANTS.SPACE_CHARACTER); 
      this.addTagsMutation.mutate(tagsToSubmit);
    }
  }

  private onGroupSelect(groupId: number) {
    this.selectedGroupId.set(groupId);
  }

  private onGroupAttach() {
    const groupId = this.selectedGroupId();
    if (groupId) {
      this.attachToGroupMutator.mutate({assetId: this.assetId(), groupId: groupId });
    }
  }

  private toDropdownOption(group : GroupInfoResponseModel) : SelectOption {
    if (group.title) {
      return {leftLabel: group.id.toString(), label: group.title, rightLabel: group.assetsCount.toString()}
    }
    return {label: `ID: ${group.id}`, rightLabel: group.assetsCount.toString()};
  }
}

