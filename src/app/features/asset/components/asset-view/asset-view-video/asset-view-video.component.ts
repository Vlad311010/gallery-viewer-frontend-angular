import { Component, ElementRef, viewChild } from '@angular/core';
import { AssetViewBase } from '../asset-view.directive';
import { INPUTS } from '@app/constants/input-constants';
import { handleInput, Keybind } from '@app/shared/utils/input-handler';

@Component({
  selector: 'asset-view-video',
  templateUrl: './asset-view-video.component.html',
  styleUrl: '../asset-view.component.scss',
  host: {
    '(window:resize)':'resizeMedia(video())',
    '(window:keydown)':'onKeyDown($event)'
  }
})
export class AssetViewVideo extends AssetViewBase {
  readonly video = viewChild<ElementRef<HTMLVideoElement>>('video');

  override getFitSize(video: HTMLVideoElement) {
    const viewport = this.getViewportSize();

    const scale = Math.min(
      viewport.width / video.videoWidth,
      viewport.height / video.videoHeight,
      1,
    );

    return {
      width: Math.round(video.videoWidth * scale),
      height: Math.round(video.videoHeight * scale),
    };
  };

  private readonly forwardBind : Keybind = new Keybind(
    [INPUTS.NEXT_PAGE_WASD, INPUTS.NEXT_PAGE_ARROWS],
    (event) => this.handleVideoControlls(event, 1),
  ) 

  private readonly backwardBind : Keybind = new Keybind(
    [INPUTS.PREV_PAGE_WASD, INPUTS.PREV_PAGE_ARROWS],
    (event) => this.handleVideoControlls(event, -1),
  ) 

  private readonly fullscreenModeBind : Keybind = new Keybind(
    [INPUTS.FULLSCREEN_MODE],
    () => this.handleVideoMode(),
  ) 
  
  private onKeyDown(event: KeyboardEvent): void {
    handleInput(event, [this.forwardBind, this.backwardBind, this.fullscreenModeBind]);
  }

  private handleVideoControlls(event: KeyboardEvent, direction: number) {
    direction = Math.sign(direction);
    if (direction === 0) { console.warn("neutral(zero) direction value") };
    
    const videoElement = this.video()?.nativeElement;
    if (!videoElement) {
      return;
    }
    
    const jumpValue = event.repeat ? 0.5 : 5.0;  
    videoElement.currentTime = videoElement.currentTime + jumpValue * direction;
  };

  private handleVideoMode() {
    const videoElement = this.video()?.nativeElement;
    if (!videoElement) {
      return;
    }

    if (!document.fullscreenElement) {
      videoElement.requestFullscreen({ navigationUI: "hide"});
    }
    else {
      document.exitFullscreen();
    } 
  }

  private isInFullscreenMode() : boolean {
    const videoElement = this.video()?.nativeElement;
    return document.fullscreenElement === videoElement;
  };
}

