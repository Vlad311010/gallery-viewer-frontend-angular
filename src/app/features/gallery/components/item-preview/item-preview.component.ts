import { Component, computed, inject, input, Signal } from '@angular/core';
import { ApiUrls } from '@contract/urls';
import { ItemLink } from '../item-link/item-link.component';
import { GridItem, ItemType } from '../items-grid/items-grid.component';
import { IsGroupPipe } from '@shared/pipes/is-group';
import { Loader } from '@app/shared/components/loader/loader.component';
import { RequestState, toRequestState } from '@app/shared/utils/request-state';
import { toObservable } from '@angular/core/rxjs-interop';
import { MediaService } from '@contract/index';
import { IsVideoPipe } from '@shared/pipes/is-video';
import { PreviewMediaImage } from '../preview-media/preview-media-image/preview-media-image.component';
import { PreviewMediaVideo } from '../preview-media/preview-media-video/preview-media-video.component';
import { ViewStateService } from '@app/shared/services/view-state.service';

@Component({
  selector: 'item-preview',
  templateUrl: './item-preview.component.html',
  styleUrl: './item-preview.component.scss',
  imports: [ItemLink, IsGroupPipe, Loader, IsVideoPipe, PreviewMediaImage, PreviewMediaVideo],
})
export class ItemPreview {
  item = input.required<GridItem>();

  private readonly apiUrls = inject(ApiUrls);
  private readonly mediaService = inject(MediaService);
  private readonly galleryState = inject(ViewStateService);

  readonly state = this.galleryState.getState;

  private isLoadingPreview = true;

  private readonly assetMetaData : Signal<RequestState<Blob>> = toRequestState(
    toObservable(this.item),
    item => {
      const itemType = item.type;
      switch (itemType) {
        case ItemType.Asset:
          return this.mediaService.assetPreviewHead(item.id)
        case ItemType.Group:
          return this.mediaService.groupPreviewHead(item.id)
      }
    },
  )

  private readonly src = computed(() => 
    this.item().type === ItemType.Asset 
    ? this.apiUrls.getAssetPreviewUrl(this.item().id)
    : this.apiUrls.getGroupPreviewUrl(this.item().id)
  );

  onPreviewLoadingChange(value: boolean) {
    this.isLoadingPreview = value;
  }
}



