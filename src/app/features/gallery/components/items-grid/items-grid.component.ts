import { Component, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import CONSTANTS from '@app/constants/gallery-constants';
import { max } from 'rxjs';

export interface GridItem {
  id: number;
  type: ItemType;
  title?: string | null;
  count?: number | null;
}

export enum ItemType {
  Asset = "Asset",
  Group = "Group"
}

@Component({
  selector: 'items-grid',
  templateUrl: './items-grid.component.html',
  styleUrl: './items-grid.component.scss',
  imports: [NgTemplateOutlet], 
  host: {
    '[style.grid-template-columns]': '`repeat(${itemsPerRow}, 1fr)`',
    '[style.grid-template-rows]': '`repeat(${rows}, 1fr)`'
  }
})
export class ItemsGrid {
  items = input.required<GridItem[]>(); 
  readonly itemTemplate = input.required<TemplateRef<{ $implicit: GridItem }>>();

  maxRows = CONSTANTS.ROWS;
  itemsPerRow = CONSTANTS.ITEMS_PER_ROW;

  rows = Math.min(this.maxRows, this.items.length / this.itemsPerRow);
}
