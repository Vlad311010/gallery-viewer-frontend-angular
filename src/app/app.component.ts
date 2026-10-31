import { Component, inject, input, ChangeDetectionStrategy, output, OutputEmitterRef } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { MediaService } from '../contract/services';
import { ApiUrls } from '../contract/urls/'
import {FormsModule} from '@angular/forms';

/*@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <img src={{src}} />
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent { 
  private readonly apiUrls = inject(ApiUrls);
  
  title = 'gallery-viewer-front-angular';
  src = this.apiUrls.getAssetUrl(1000);
}*/

@Component({
    selector: 'user-oc',
    template: `<span (click)="onClick()" > occupation is: {{occupation()}} ({{age}}) </span>`,
})
class User {
  occupation = input.required<string>();
  age = 18;
  ageIncrementEvent = output<number>(); 

  onClick() {
    this.age++;
    this.ageIncrementEvent.emit(this.age);
  }
} 

@Component({
    imports: [User, RouterOutlet, FormsModule],
    selector: 'app-root',
    styleUrl: './app.component.scss',
    template: `
    <div> 
      Some Input Element
      <input id='input' [(ngModel)]="inputText" />
      <h2>The bool: {{inputValue}}</h2>
      <h2>The Text: {{inputText}}</h2>
      <button (click)="switch()"> PRESS ME !!! </button>  
      <user-oc occupation="arr" (ageIncrementEvent)="age($event)" />
    
    <nav>
      <a href="/">Home</a>
      |
      <a href="/user">User</a>
    </nav>
    <router-outlet />
     
    </div>`
})
export class AppComponent {
  inputValue = true;
  inputText = "true?";
   
  switch() {
    this.inputValue = !this.inputValue;
  }

  age(age: number) {
    console.log("Age:", age);
  }
}

