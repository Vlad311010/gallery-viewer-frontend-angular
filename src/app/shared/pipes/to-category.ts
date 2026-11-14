import { Pipe, type PipeTransform } from '@angular/core';
import { tagCategoryToCssClass } from '@shared/utils/util-functions';

@Pipe({
  name: 'toCategoryClass',
  standalone: true,
})
export class ToCategoryClassPipe implements PipeTransform {
  transform(categoryString: string): string {
    return tagCategoryToCssClass(categoryString);
  }
}