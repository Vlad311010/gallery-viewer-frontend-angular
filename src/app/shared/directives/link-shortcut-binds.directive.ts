import { Directive, input, inject } from '@angular/core';
import { handleInput, Keybind } from "@shared/utils/input-handler";
import { MouseTrackingService } from '../services/mouse-tracking.service';
import INPUT_CONSTANTS from '@app/constants/input-constants';

@Directive({
  selector: '[refShortcut]',
  host: {
    '(window:keydown)': 'onKeyDown($event)'
  },
})
export class LinkShortcutBinds {
  readonly elementFilter = input.required<string>();
  
  protected readonly mouseTracking = inject(MouseTrackingService);

  private openRef() {
    const pos = this.mouseTracking.mousePosition();

    const linkElement = document
      .elementsFromPoint(pos.x, pos.y)
      .find(element => element.closest(this.elementFilter()))
      ?.closest(this.elementFilter());

    if (linkElement) {
      const ref = linkElement.querySelector<HTMLAnchorElement>("a")?.href;

      if (ref) {
        window.open(ref);
      }
    }
  }

  private readonly openRefBind : Keybind = new Keybind( 
    [INPUT_CONSTANTS.FOLLOW_LINK],
    () => this.openRef(),
  )
  
  private onKeyDown(event: KeyboardEvent): void {
    handleInput(event, [this.openRefBind]);
  }
}