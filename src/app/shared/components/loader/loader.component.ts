import { Component, input, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { timer } from "rxjs";

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class Loader {
  private readonly defaultSize = 24;
  private readonly defaultBounds = 50;

  showLoader = input.required<boolean>();
  minimalDisplayTimeInSeconds = input<number>(0.1);

  size = input<number>(this.defaultSize);
  color = input<string>('#eee7f8');
  thickness = input<number>(3);
  boundWidth = input<number>(this.defaultBounds);
  boundHeight = input<number>(this.defaultBounds);

  minimalDiplayTimeEnded = signal(false);

  constructor() {
    if (this.minimalDisplayTimeInSeconds() <= 0) {
      this.minimalDiplayTimeEnded.set(true);
    }
    else {
      timer(this.minimalDisplayTimeInSeconds() * 1000)
        .pipe(takeUntilDestroyed())
        .subscribe(() => {
          this.minimalDiplayTimeEnded.set(true);
        });
    }
  }
}