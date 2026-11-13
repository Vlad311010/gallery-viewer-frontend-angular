import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isVideo',
  standalone: true,
})
export class IsVideoPipe implements PipeTransform {
  transform(blob: Blob | null | undefined): boolean;
  transform(contentType: string | null | undefined): boolean;
  transform(value: Blob | string | null | undefined): boolean {
    if (!value) {
      return false;
    }

    const contentType = typeof value === 'string'
    ? value
    : value.type;

    return contentType.startsWith('video');
  }
}