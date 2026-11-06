import { Component } from "@angular/core";
import { PreviewMediaBase } from "../preview-media-base.directive";

@Component({
  selector: 'preview-media-image',
  templateUrl: './preview-media-image.component.html',
  styleUrl: '../preview-media.component.scss'
})
export class PreviewMediaImage extends PreviewMediaBase {}