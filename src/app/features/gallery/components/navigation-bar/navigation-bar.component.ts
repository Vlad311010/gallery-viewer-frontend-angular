import { Component } from '@angular/core';
import { FiltersInput } from '../filters-input/filters-input.component';

@Component({
  selector: 'navigation-bar',
  styleUrl: './navigation-bar.component.scss',
  templateUrl: './navigation-bar.component.html',
  imports: [FiltersInput],
})
export class NavigationBar {
}
