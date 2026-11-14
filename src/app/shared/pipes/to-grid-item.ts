import { Pipe, type PipeTransform } from '@angular/core';
import { GridItem, ItemType } from '@app/features/gallery/components/items-grid/items-grid.component';
import { DisplayItemResponseModel, DisplayItemType } from '@contract/index';


@Pipe({
  name: 'toGridItem',
  standalone: true,
})
export class ToGridItemPipe implements PipeTransform {
  transform(items: Array<DisplayItemResponseModel>): Array<GridItem> {
    return items.map((x) => ( {id: x.id, type: mapItemType(x.type), title: x.title, count: x.count} ) );
  }

}

function mapItemType(type: DisplayItemType): ItemType {
  switch (type) {
    case DisplayItemType.Asset:
      return ItemType.Asset;

    case DisplayItemType.Group:
      return ItemType.Group;
  }
}