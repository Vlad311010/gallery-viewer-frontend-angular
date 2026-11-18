import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withXhr } from "@angular/common/http";
import { provideDefaultClient } from "../contract/providers";

import { routes } from './app.routes';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withXhr()),
    provideTanStackQuery(new QueryClient()),
    provideDefaultClient({
      basePath: environment.apiBaseUrl
    })
  ]
};
