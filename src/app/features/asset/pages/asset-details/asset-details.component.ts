import { Component, computed, inject, input } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { TagsService, ApiUrlsService, AssetsService, TagDtoInfo, MediaService } from '@contract/index';
import { lastValueFrom } from 'rxjs';
import { KeyValue, KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { ToCategoryClassPipe } from '@app/shared/pipes/to-category';
import { AssetTagsResponseModel } from '@contract/models/index';
import { IsVideoPipe } from '@shared/pipes/is-video';
import { NgxToastService } from 'ngx-toastf';
import { toastDefaultOptions } from '@app/shared/utils/toasts-hepler';
import { ViewStateService } from '@app/shared/services/view-state.service';


@Component({
  selector: 'asset-details',
  templateUrl: 'asset-details.component.html',
  styleUrl: 'asset-details.component.scss',
  imports: [KeyValuePipe, NgTemplateOutlet, ToCategoryClassPipe, IsVideoPipe]
})
export class AssetDetails {
  assetId = input.required<number>();
  
  urlsService = inject(ApiUrlsService)
  tagsService = inject(TagsService);
  assetsService = inject(AssetsService);
  mediaService = inject(MediaService);
  toastService = inject(NgxToastService);
  queryClient = inject(QueryClient);
  viewState = inject(ViewStateService);
  
  assetUrl = computed(() => this.urlsService.getAssetUrl(this.assetId()));

  private readonly categoriesOrder = ['author', 'source', 'character', 'general'];
  
  private readonly compareCategories = (a: KeyValue<string, TagDtoInfo[]>, b: KeyValue<string, TagDtoInfo[]>) =>
    this.categoriesOrder.indexOf(a.key) - this.categoriesOrder.indexOf(b.key);

  mimeType = computed(() => this.assetMimeTypeQuery.data()?.type);

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

    onSuccess: async response => {
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

  private removeTag(tag: string) {
    if (window.confirm("Remove?")) {
      this.removeTagMutation.mutate(tag);
    }
  }
}

