import { Component, ElementRef, viewChild } from '@angular/core';
import { AssetViewBase } from '../asset-view.directive';
import { handleInput, Keybind } from '@app/shared/utils/input-handler';
import INPUTS from '@app/constants/input-constants';

@Component({
  selector: 'asset-view-image',
  templateUrl: './asset-view-image.component.html',
  styleUrl: '../asset-view.component.scss',
  host: {
    '(window:resize)':'resizeMedia(image())',
    '(window:keydown)':'onKeyDown($event)'
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

  private readonly prevAssetBind : Keybind = new Keybind( 
    [INPUTS.PREV_PAGE_WASD, INPUTS.PREV_PAGE_ARROWS],
    () => this.prevGroupAsset(),
  )
  private readonly nextAssetBind : Keybind = new Keybind(
    [INPUTS.NEXT_PAGE_WASD, INPUTS.NEXT_PAGE_ARROWS],
    () => this.nextGroupAsset(),
  ) 
  
  onKeyDown(event: KeyboardEvent): void {
    handleInput(event, [this.prevAssetBind, this.nextAssetBind]);
  }
}

