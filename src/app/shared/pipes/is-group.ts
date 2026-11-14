import { Pipe, type PipeTransform } from '@angular/core';
import { ItemType } from '@app/features/gallery/components/items-grid/items-grid.component';


@Pipe({
  name: 'isGroup',
  standalone: true,
})
export class IsGroupPipe implements PipeTransform {
  transform(type: ItemType): boolean {
    return type === ItemType.Group;
  }
}