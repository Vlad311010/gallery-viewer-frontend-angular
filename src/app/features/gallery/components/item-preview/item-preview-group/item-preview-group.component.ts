import { Component, input, inject, signal, effect, output, computed, Signal } from '@angular/core';
import { GridItem, ItemType } from '../../items-grid/items-grid.component';
import { ItemPreview } from '../item-preview.component';
import { ViewStateService } from '@app/shared/services/view-state.service';
import { ViewState } from '@shared/services/view-state.service';
import { AssetsService } from '@contract/index';
import { toRequestState } from '@app/shared/utils/request-state';
import { toObservable } from '@angular/core/rxjs-interop';
import { single } from 'rxjs';


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
  id = input.required<number>(); 
  type = input.required<ItemType>();
  position = input.required<number>();
  normalizedPosition = input.required<number>();
  isAssetAddRemoveAllowed = input.required<boolean>();
  isCoverAsset = input.required<boolean>();
  title = input<string>();
  count = input<number>(); 

  coverFlagChange = output<boolean>();
  positionChange = output<number>();


  viewStateService = inject(ViewStateService)
  assetsService = inject(AssetsService)

  viewState = this.viewStateService.getState();
  
  private onCoverFlagChange(event: PointerEvent) {
    const checkbox = (event.target as HTMLInputElement)
    this.coverFlagChange.emit(checkbox.checked);
  }

  private onPositionValueChange(event: Event) {
    const input = (event.target as HTMLInputElement)
    const value = Number(input.value);
    if (Number.isNaN(value) || value < 0) {
      input.value = "0";
      this.updatePositionInputValue(0); 
      return;
    }
    
    this.updatePositionInputValue(value); 
  }

  private updatePositionInputValue(value: number) {
    this.positionChange.emit(value);
  }
}




