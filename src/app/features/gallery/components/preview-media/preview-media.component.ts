import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { CONSTANTS } from '@app/constants/static-files-constants';
import { ApiUrls } from '@contract/urls';

@Component({
  selector: 'preview-media',
  templateUrl: './preview-media.component.html',
  styleUrl: './preview-media.component.scss',
  imports: [NgTemplateOutlet]
})
export class PreviewMedia {
  itemId = input.required<number>();
  showEditLable = input<boolean>(true);
  isGroup = input<boolean>(false);
  isVideo = input<boolean>(false);
  
  private readonly apiUrls = inject(ApiUrls);
  
  private previewUrl = computed(() =>
    this.isGroup()
      ? this.apiUrls.getGroupPreviewUrl(this.itemId())
      : this.apiUrls.getAssetPreviewUrl(this.itemId())
  )
  
  readonly classStyle = computed(() =>
    this.isGroup()
      ? 'item-group'
      : `item-asset ${this.isVideo() ? 'video' : ''}`
  );

  
  onPreviewError(): void {
    this.previewUrl = signal(CONSTANTS.ASSET_NOT_FOUND_IMAGE);
  } 

  onMouseEnter(event: MouseEvent): void {
    const video = event.currentTarget as HTMLVideoElement;
    video.play();
  }

  onMouseLeave(event: MouseEvent): void {
    const video = event.currentTarget as HTMLVideoElement;
    video.pause();
    video.currentTime = 0;
  }

  
}