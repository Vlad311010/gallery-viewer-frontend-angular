import { INPUTS } from "@app/constants/input-constants";
import { handleInput, Keybind } from "../utils/input-handler";
import { Directive } from "@angular/core";

@Directive({
  selector: '[pageScrollBinds]',
  host: {
    '(window:keydown)': 'onKeyDown($event)'
  },
})
export class PageScrollBinds {
  private ScrollPage(directive: number, smooth: boolean = true) {
    window.scrollTo({
        top: document.documentElement.scrollTop + 250 * Math.sign(directive),
        left: document.documentElement.scrollLeft,
        behavior: smooth ? "smooth" : "instant",
    });
  }

  private readonly prevPageBind : Keybind = new Keybind( 
    [INPUTS.SCROLL_UP_WASD, INPUTS.SCROLL_UP_ARROWS],
    () => this.ScrollPage(-1),
  )
  private readonly nextPageBind : Keybind = new Keybind(
    [INPUTS.SCROLL_DOWN_WASD, INPUTS.SCROLL_DOWN_ARROWS],
    () => this.ScrollPage(1),
  ) 
  private onKeyDown(event: KeyboardEvent): void {
    
    handleInput(event, [this.prevPageBind, this.nextPageBind]);
  }
}