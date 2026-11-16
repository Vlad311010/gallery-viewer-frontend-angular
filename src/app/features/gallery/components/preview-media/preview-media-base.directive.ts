import { computed, Directive, input, output, signal } from '@angular/core';
import CONSTANTS from "@app/constants/static-files-constants";

@Directive()
export abstract class PreviewMediaBase {
  itemId = input.required<number>();
  src = input.required<string>();
  isGroup = input.required<boolean>();
  showEditLabel = input.required<boolean>();

  readonly loadingChange = output<boolean>();

  private readonly previewLoadingError = signal(false);

  onPreviewLoad() {
    this.loadingChange.emit(false);
  } 

  onPreviewError(event: Event): void {
    this.previewLoadingError.set(true)
    this.onPreviewLoad();
  } 

  readonly previewUrl = computed(() =>
    this.previewLoadingError()
      ? CONSTANTS.ASSET_NOT_FOUND_IMAGE
      : this.src()
  )

  readonly classStyle = computed(() => 
    this.isGroup()
      ? 'item-group'
      : 'item-asset'
  );
}