import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withXhr } from "@angular/common/http";
import { provideDefaultClient } from "../contract/providers";

import { routes } from './app.routes';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { environment } from '../environments/environment';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withXhr()),
    provideTanStackQuery(queryClient),
    provideDefaultClient({
      basePath: environment.apiBaseUrl
    })
  ]
};
