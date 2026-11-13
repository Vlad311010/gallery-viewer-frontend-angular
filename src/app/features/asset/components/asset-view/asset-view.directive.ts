import { computed, Directive, ElementRef, inject, input, signal } from '@angular/core';
import { ApiUrlsService } from '@contract/urls/index';

export interface ElementSize {
  width: number;
  height: number;
}

@Directive()
export abstract class AssetViewBase {
  id = input.required<number>();

  private readonly urlsService = inject(ApiUrlsService);
  
  contentSize = signal({ width: 0, height: 0,});
  zoomedIn = signal(false);

  protected assetUrl = computed(() => this.urlsService.getAssetUrl(this.id()));

  abstract getFitSize(mediaElement: HTMLElement) : ElementSize;

  protected resizeMedia(elementRef?: ElementRef<HTMLImageElement | HTMLVideoElement>) {
    if (!elementRef) {
      return;
    }

    this.contentSize.set(this.getFitSize(elementRef.nativeElement));
  }

  protected getViewportSize() {
    return {
      width: window.visualViewport?.width ?? window.innerWidth,
      height: window.visualViewport?.height ?? window.innerHeight
    }
  };

  private onLoad(event: Event) {
    const target = event.target;
    if (target instanceof HTMLImageElement || target instanceof HTMLVideoElement) {
      this.resizeMedia(new ElementRef(target));
    }
  };

  private onZoom(event: PointerEvent) {
    const img = event.currentTarget ;
    if (!(img instanceof HTMLImageElement)) {
      return;
    }

    const rect = img.getBoundingClientRect();

    // Mouse position relative to the image
    const relativeX = (event.clientX - rect.left) / rect.width;
    const relativeY = (event.clientY - rect.top) / rect.height;

    const fitSize = this.getFitSize(img);

    const newSize = this.zoomedIn()
      ? fitSize
      : {
          width: img.naturalWidth,
          height: img.naturalHeight,
        };

    this.zoomedIn.update((value) => !value);
    this.contentSize.set(newSize);

    requestAnimationFrame(() => {
      const newRect = img.getBoundingClientRect();

      const newPointX = newRect.left + newRect.width * relativeX;
      const newPointY = newRect.top + newRect.height * relativeY;

      window.scrollBy({
        left: newPointX - event.clientX,
        top: newPointY - event.clientY,
        behavior: "instant",
      });
    });
  };
}

