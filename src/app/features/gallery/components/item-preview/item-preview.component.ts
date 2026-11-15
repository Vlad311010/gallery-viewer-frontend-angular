import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ApiUrlsService } from '@contract/urls';
import { ItemLink } from '../item-link/item-link.component';
import { GridItem, ItemType } from '../items-grid/items-grid.component';
import { IsGroupPipe } from '@shared/pipes/is-group';
import { Loader } from '@app/shared/components/loader/loader.component';
import { MediaService } from '@contract/index';
import { IsVideoPipe } from '@shared/pipes/is-video';
import { PreviewMediaImage } from '../preview-media/preview-media-image/preview-media-image.component';
import { PreviewMediaVideo } from '../preview-media/preview-media-video/preview-media-video.component';
import { ViewStateService } from '@app/shared/services/view-state.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'item-preview',
  templateUrl: './item-preview.component.html',
  styleUrl: './item-preview.component.scss',
  imports: [ItemLink, IsGroupPipe, Loader, IsVideoPipe, PreviewMediaImage, PreviewMediaVideo],
})
export class ItemPreview {
  item = input.required<GridItem>();

  private readonly urlsService = inject(ApiUrlsService);
  private readonly mediaService = inject(MediaService);
  private readonly viewState = inject(ViewStateService);

  private isLoadingPreview = signal(true);

  private readonly assetMetadataQuery = injectQuery(() => ({
    queryKey: [
      MediaService.name,
      {
        id: this.item().id,
        type: this.item().type
      }
    ],
    queryFn: () => {
      const item = this.item();
      switch (item.type) {
        case ItemType.Asset:
          return lastValueFrom(this.mediaService.assetPreviewHead(item.id));
        case ItemType.Group:
          return lastValueFrom(this.mediaService.groupPreviewHead(item.id));
      }
    }
  }))

  private readonly src = computed(() => 
    this.item().type === ItemType.Asset 
    ? this.urlsService.getAssetPreviewUrl(this.item().id)
    : this.urlsService.getGroupPreviewUrl(this.item().id)
  );

  onPreviewLoadingChange(value: boolean) {
    this.isLoadingPreview.set(value);
  }
}
