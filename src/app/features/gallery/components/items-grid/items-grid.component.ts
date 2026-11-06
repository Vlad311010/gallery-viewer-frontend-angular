import { Component, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface GridItem {
  type: ItemType;
  id: number;
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
  imports: [NgTemplateOutlet]
})
export class ItemsGrid {
  items = input.required<GridItem[]>(); 
  readonly itemTemplate = input.required<TemplateRef<{ $implicit: GridItem }>>();
}


export function isGroup(item: GridItem): boolean {
  return item.type === ItemType.Group;
}