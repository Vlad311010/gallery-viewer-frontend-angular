import { Component, input } from "@angular/core";

@Component({
  selector: 'error-message',
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
})
export class DisplayError {
  status = input.required<number>();
  title = input.required<string>();
  details = input.required<string | undefined | null>();

  back() {
    window.history.back();
  }

  reload() {
    window.location.reload();
  }
} 