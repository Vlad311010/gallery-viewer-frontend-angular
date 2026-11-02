import { Component, input } from '@angular/core';
import { ItemPreview } from "../item-preview/item-preview.component";

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrl: './gallery-list.component.scss',
  imports: [ItemPreview]
})
export class GalleryList {
  galleryName = input<string>("img");
  
  
}