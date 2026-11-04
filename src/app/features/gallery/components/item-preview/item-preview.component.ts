import { Component, computed, inject, input } from '@angular/core';
import { ApiUrls } from '@contract/urls';
import { PreviewMedia } from '../preview-media/preview-media.component';
import { ItemLink } from '../item-link/item-link.component';
import { GridItem, ItemType } from '../items-grid/items-grid.component';
import { IsGroupPipe } from '@shared/pipes/is-group';
import { Loader } from '@app/shared/components/loader/loader.component';


@Component({
  selector: 'item-preview',
  templateUrl: './item-preview.component.html',
  styleUrl: './item-preview.component.scss',
  imports: [PreviewMedia, ItemLink, IsGroupPipe, Loader],
})
export class ItemPreview {
  item = input.required<GridItem>();

  private readonly apiUrls = inject(ApiUrls);

  private isLoadingPreview = true;
  
  src = computed(() => 
    this.item().type == ItemType.Asset 
    ? this.apiUrls.getAssetPreviewUrl(this.item().id)
    : this.apiUrls.getGroupPreviewUrl(this.item().id)
  );

  onPreviewLoadingChange(value: boolean) {
    this.isLoadingPreview = value;
  }
}



