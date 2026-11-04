import { Component, input } from "@angular/core";

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class Loader {
  size = input<number>(24);
  color = input<string>('#eee7f8');
  thickness = input<number>(3);
}