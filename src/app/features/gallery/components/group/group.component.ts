import { Component, input } from '@angular/core';



@Component({
  selector: 'group',
  template: `<h2>group id {{ id() }}</h2>`
})
export class Group {
  id = input.required<number>();

}



