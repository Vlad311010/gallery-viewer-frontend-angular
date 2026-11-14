import { Component } from "@angular/core";
import { ToCategoryClassPipe } from "@app/shared/pipes/to-category";
import { TagSearch } from "@shared/directives/tag-search.directive";



@Component({
  selector: 'filters-input',
  templateUrl: './filters-input.component.html',
  styleUrl: './filters-input.component.scss',
  imports: [ToCategoryClassPipe]
})
export class FiltersInput extends TagSearch {
  override submit(inputValue: string) {
    console.log(inputValue);
  }
}