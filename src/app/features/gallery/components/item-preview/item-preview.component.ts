import { Component, computed, inject, input } from '@angular/core';
import { ApiUrls } from '@contract/urls';
import { PreviewMedia } from '../preview-media/preview-media.component';
import { ItemLink } from '../item-link/item-link.component';



@Component({
  selector: 'item-preview',
  templateUrl: './item-preview.component.html',
  styleUrl: './item-preview.component.scss',
  imports: [PreviewMedia, ItemLink]
})
export class ItemPreview {
  itemId = input.required<number>();
  // displayItem = input<DisplayItemResponseModel>()

  private readonly apiUrls = inject(ApiUrls);
  
  src = computed(() => this.apiUrls.getAssetUrl(this.itemId()));
}



