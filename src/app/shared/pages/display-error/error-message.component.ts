import { HttpErrorResponse } from "@angular/common/http";
import { Component, input, computed } from '@angular/core';

interface ApiError {
  status: number
  details?: string
  title: string 
}

@Component({
  selector: 'error-message',
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
})
export class DisplayError {
  // error = input.required<Error>();
  error = input<Error>();
  
  apiErrorDetails = computed(() => this.getErrorMessage(this.error()));

  private back() {
    window.history.back();
  }

  private reload() {
    window.location.reload();
  }

  private getErrorMessage(
    error: unknown,
    fallbackMessage?: string
  ): ApiError {
    const defaultTitle = 'Request Failed';
    console.log(error);
    if (error instanceof HttpErrorResponse) {
      return {
        status: error.status ?? 500,
        title: error.error.title || defaultTitle,
        details: fallbackMessage
      };
    }

    return {
      status: 500,
      title: defaultTitle,
      details: fallbackMessage
    };
  }
} 

