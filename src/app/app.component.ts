import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { DefaultLayout } from '@shared/layouts/default-layout/default-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DefaultLayout],
  templateUrl: './app.component.html'  
})
export class AppComponent { 
}
