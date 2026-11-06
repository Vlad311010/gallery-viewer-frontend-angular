import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CONSTANTS } from '@app/constants/static-files-constants';

@Component({
  selector: 'preview-media',
  templateUrl: './preview-media.component.html',
  styleUrl: './preview-media.component.scss',
  imports: [NgTemplateOutlet]
})
export class PreviewMedia {
  itemId = input.required<number>();
  src = input.required<string>();
  isGroup = input.required<boolean>();
  showEditLable = input.required<boolean>();
  isVideo = input.required<boolean>();

  readonly loadingChange = output<boolean>();
  
  private readonly previewLoadingError = signal(false);

  constructor() {
  effect(() => {
    this.isVideo();

    this.previewLoadingError.set(false);
    this.loadingChange.emit(true);
  });
}
  
  private readonly previewUrl = computed(() =>
    this.previewLoadingError()
      ? CONSTANTS.ASSET_NOT_FOUND_IMAGE
      : this.src()
  )
  private readonly classStyle = computed(() => 
    this.isGroup()
      ? 'item-group'
      : `item-asset ${this.isVideo() ? 'video' : ''}`
  );
    
  private async onPreviewLoad() {
    this.loadingChange.emit(false);
  } 

  private onPreviewError(event: Event): void {
    this.previewLoadingError.set(true)
    this.loadingChange.emit(false);
  } 

  private onMouseEnter(event: MouseEvent): void {
    const video = event.currentTarget as HTMLVideoElement;
    video.play();
  }

  private onMouseLeave(event: MouseEvent): void {
    const video = event.currentTarget as HTMLVideoElement;
    video.pause();
    video.currentTime = 0;
  }
}