import { Component } from "@angular/core";
import { PreviewMediaBase } from "../preview-media-base.directive";

@Component({
  selector: 'preview-media-video',
  templateUrl: './preview-media-video.component.html',
  styleUrl: '../preview-media.component.scss'
})
export class PreviewMediaVideo extends PreviewMediaBase {
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