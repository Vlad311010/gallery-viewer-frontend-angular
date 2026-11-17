import { Injectable, signal } from "@angular/core";
import { fromEvent, tap, throttleTime } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MouseTrackingService {
  private mousePos = signal({ x: 0, y: 0 });
  
  readonly mousePosition = this.mousePos.asReadonly();
  
  constructor() {
    fromEvent<MouseEvent>(document, 'mousemove')
    .pipe(
      throttleTime(50),
      tap(event => {
        this.handleMouseMove(event);
      })
    )
    .subscribe();
  }

  private handleMouseMove = (e: MouseEvent) => {
    this.mousePos.set({x: e.clientX, y: e.clientY});
  };
}

  