import { Component, computed, inject, input } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { ApiUrlsService, AssetsService, TagDtoInfo, MediaService, GroupsService } from '@contract/index';
import { lastValueFrom } from 'rxjs';
import { KeyValue, KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { ToCategoryClassPipe } from '@app/shared/pipes/to-category';
import { AssetTagsResponseModel } from '@contract/models/index';
import { IsVideoPipe } from '@shared/pipes/is-video';
import { NgxToastService } from 'ngx-toastf';
import { toastDefaultOptions } from '@app/shared/utils/toasts-hepler';
import { ViewStateService } from '@app/shared/services/view-state.service';
import { GroupManaging, TagsInput } from '@app/features/asset/components';
import CONSTANTS from '@app/constants/tag-constants';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'asset-details',
  templateUrl: 'asset-details.component.html',
  styleUrl: 'asset-details.component.scss',
  imports: [KeyValuePipe, NgTemplateOutlet, ToCategoryClassPipe, IsVideoPipe, TagsInput, RouterLink, GroupManaging]
})
export class AssetDetails {
  assetId = input.required<number>();  
  returnUrl = input<string>();
  
  private readonly urlsService = inject(ApiUrlsService)
  private readonly assetsService = inject(AssetsService);
  private readonly mediaService = inject(MediaService);
  private readonly groupsService = inject(GroupsService);
  private readonly toastService = inject(NgxToastService);
  private readonly queryClient = inject(QueryClient);
  private readonly viewState = inject(ViewStateService);
  
  assetUrl = computed(() => this.urlsService.getAssetUrl(this.assetId()));
  groupUrl = computed(() => this.assetInfoQuery.data()?.groupId ? `../../group/${this.assetInfoQuery.data()?.groupId}` : null);

  private readonly categoriesOrder = ['author', 'source', 'character', 'general'];
  
  private readonly compareCategories = (a: KeyValue<string, TagDtoInfo[]>, b: KeyValue<string, TagDtoInfo[]>) =>
    this.categoriesOrder.indexOf(a.key) - this.categoriesOrder.indexOf(b.key);

  mimeType = computed(() => this.assetMimeTypeQuery.data()?.type);

  readonly tagsQuery = injectQuery(() => ({
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

  private readonly assetMimeTypeQuery = injectQuery(() => ({
    queryKey: [
      MediaService.name,
      ...this.urlsService.getAssetTagsQueryKey(this.assetId())
    ],
    queryFn: () => {
      return lastValueFrom(this.mediaService.assetHead(this.assetId()));
    }
  }))

  readonly assetGroupDetailsQuery = injectQuery(() => {
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

  onTagRemove(tag: string) {
    if (window.confirm("Remove?")) {
      this.removeTagMutation.mutate(tag);
    }
  }

  onAddTagsSubmit(tags: string) {
    tags = tags.trim();
    if (!tags) {
      return;
    }

    if (window.confirm("Submit?")) {
      const tagsToSubmit = tags.split(CONSTANTS.SPACE_CHARACTER); 
      this.addTagsMutation.mutate(tagsToSubmit);
    }
  }
}

