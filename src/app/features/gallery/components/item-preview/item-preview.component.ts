import { Component, computed, inject, input } from '@angular/core';
import { ApiUrls } from '@contract/urls';
import { PreviewMedia } from '../preview-media/preview-media.component';
import { ItemLink } from '../item-link/item-link.component';
import { GridItem, ItemType } from '../items-grid/items-grid.component';
import { IsGroupPipe } from '@shared/pipes/is-group';
import { Loader } from '@app/shared/components/loader/loader.component';
import { toRequestData } from '@app/shared/utils/request-state';
import { toObservable } from '@angular/core/rxjs-interop';
import { MediaService } from '@contract/index';
import { IsVideoPipe } from '../../../../shared/pipes/is-video';



@Component({
  selector: 'item-preview',
  templateUrl: './item-preview.component.html',
  styleUrl: './item-preview.component.scss',
  imports: [PreviewMedia, ItemLink, IsGroupPipe, Loader, IsVideoPipe],
})
export class ItemPreview {
  item = input.required<GridItem>();

  private readonly apiUrls = inject(ApiUrls);
  private readonly mediaService = inject(MediaService);

  private isLoadingPreview = true;

  private readonly assetMetaData = toRequestData(
    toObservable(this.item),
    item => {
      const itemType = this.item().type;
      switch (itemType) {
        case ItemType.Asset:
          return this.mediaService.assetPreviewHead(item.id)
        case ItemType.Group:
          return this.mediaService.groupPreviewHead(item.id)
      }
    },
    null
  )

  private readonly src = computed(() => 
    this.item().type == ItemType.Asset 
    ? this.apiUrls.getAssetPreviewUrl(this.item().id)
    : this.apiUrls.getGroupPreviewUrl(this.item().id)
  );

  onPreviewLoadingChange(value: boolean) {
    this.isLoadingPreview = value;
  }
}



