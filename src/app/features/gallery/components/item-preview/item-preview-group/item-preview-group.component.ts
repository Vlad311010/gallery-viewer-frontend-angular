import { Component, input, inject, signal, effect, output } from '@angular/core';
import { GridItem, ItemType } from '../../items-grid/items-grid.component';
import { ItemPreview } from '../item-preview.component';
import { ViewStateService } from '@app/shared/services/view-state.service';
import { ViewState } from '@shared/services/view-state.service';
import { AssetsService } from '@contract/index';
import { toRequestState } from '@app/shared/utils/request-state';
import { toObservable } from '@angular/core/rxjs-interop';

interface GroupAssetDetails {
  isAssetAddRemoveAllowed: boolean,
  
  position: number,
  // updateAssetPosition: updateAssetPosition,
  
  isCoverAsset: boolean // coverAssetId: coverAssetId,
  // setCoverAsset: setCoverAsset
}

export interface GroupGridItem extends GridItem  {
  isAssetAddRemoveAllowed: boolean,
  position: number,
  isCoverAsset: boolean
}


@Component({
  selector: 'item-preview-group',
  templateUrl: './item-preview-group.component.html',
  styleUrl: './item-preview-group.component.scss',
  imports: [ItemPreview],
})
export class ItemPreviewGroup {
  item = input.required<GroupGridItem>();
  
  coverFlagChange = output<boolean>();

  viewStateService = inject(ViewStateService)
  assetsService = inject(AssetsService)

  viewState = this.viewStateService.getState();

  onCoverFlagChange(event: PointerEvent) {
    const checkbox = (event.target as HTMLInputElement)
    this.coverFlagChange.emit(checkbox.checked);
  }

  onPositionValueChange(event: Event) {
    const input = (event.target as HTMLInputElement)
    console.log(input.value);
  }
}




