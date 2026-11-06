import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isVideo',
  standalone: true,
})
export class IsVideoPipe implements PipeTransform {
  transform(blob: Blob | null | undefined): boolean {
    if (!blob) {
      return false;
    }

    return blob.type.startsWith("video");
  }
}