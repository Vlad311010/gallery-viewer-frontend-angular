import { Component, input } from '@angular/core';
import { ItemPreview } from "../item-preview/item-preview.component";
import { GridItem, ItemsGrid, ItemType } from '../items-grid/items-grid.component';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrl: './gallery-list.component.scss',
  imports: [ItemPreview, ItemsGrid]
})
export class GalleryList {
  galleryName = input<string>("img");

  items : GridItem[] = [
    { type : ItemType.Asset, id: 2598 },
    { type : ItemType.Group, id: 133 },
    { type : ItemType.Asset, id: 2584 },
    { type : ItemType.Asset, id: 2587 },
    { type : ItemType.Asset, id: 2603 },
    { type : ItemType.Asset, id: 2619 },    
    { type : ItemType.Asset, id: 2602 },    
    { type : ItemType.Asset, id: 2601 },    
    { type : ItemType.Group, id: 134 },    
    { type : ItemType.Asset, id: 2608 },   
    { type : ItemType.Asset, id: 2607 },    
    { type : ItemType.Asset, id: 2614 },    
    { type : ItemType.Asset, id: 2618 },     
    { type : ItemType.Asset, id: 2613 }    
  ]; 
  
}