import { Component, ElementRef, viewChild } from '@angular/core';
import { AssetViewBase } from '../asset-view.directive';

@Component({
  selector: 'asset-view-image',
  templateUrl: './asset-view-image.component.html',
  styleUrl: '../asset-view.component.scss',
  host: {
    '(window:resize)':'resizeMedia(image())'
  }
})
export class AssetViewImage extends AssetViewBase {
  readonly image = viewChild<ElementRef<HTMLImageElement>>('image');

  override getFitSize(mediaElement: HTMLImageElement) {
    const viewport = this.getViewportSize();

    const scale = Math.min(
      viewport.width / mediaElement.naturalWidth,
      viewport.height / mediaElement.naturalHeight,
      1,
    );

    return {
      width: Math.round(mediaElement.naturalWidth * scale),
      height: Math.round(mediaElement.naturalHeight * scale),
    };
  };
}

