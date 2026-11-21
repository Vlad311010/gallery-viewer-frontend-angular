import { Component } from '@angular/core';
import { NavigationBar } from '@app/features/tag/components';

@Component({
  selector: 'tags-list',
  styleUrl: './tags-list.component.scss',
  templateUrl: './tags-list.component.html',
  imports: [NavigationBar],
})
export class TagsList {
}
