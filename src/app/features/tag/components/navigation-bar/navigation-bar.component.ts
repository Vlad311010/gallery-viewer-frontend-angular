import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'navigation-bar',
  styleUrl: './navigation-bar.component.scss',
  templateUrl: './navigation-bar.component.html',
  imports: [RouterLink]
})
export class NavigationBar {
}
