import { Component, input } from "@angular/core";

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class Loader {
  private readonly defaultSize = 24;
  private readonly defaultBounds = 50;

  size = input<number>(this.defaultSize);
  color = input<string>('#eee7f8');
  thickness = input<number>(3);
  boundWidth = input<number>(this.defaultBounds);
  boundHeight = input<number>(this.defaultBounds);
}