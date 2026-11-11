import { Component, inject } from '@angular/core';
import { ApiUrlsService, GalleryResponseModel, GalleryService } from '@contract/index';
import { DisplayError } from '@app/shared/pages/display-error/error-message.component';
import { NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { injectQuery } from '@tanstack/angular-query-experimental';

interface GalleryThumbnail {
  id: number;
  name: string;
  thumbnailUrl?: string;
}

@Component({
  selector: 'gallery-select',
  styleUrl: './gallery-select.component.scss',
  templateUrl: './gallery-select.component.html',
  imports: [DisplayError, NgTemplateOutlet, RouterLink, UpperCasePipe],
})
export class GallerySelect {
  galleryService = inject(GalleryService);
  urlsService = inject(ApiUrlsService);

  private readonly galleriesQuery = injectQuery(() => ({
    queryKey: [
      GalleryService.name,
      ...this.urlsService.getGalleriesQueryKey(),
    ],
    queryFn: () => 
      lastValueFrom(
        this.galleryService.galleries()
      ),
    select: (response: GalleryResponseModel[])  => 
      response.map<GalleryThumbnail>(x => ({
        id: x.id,
        name: x.name,
        thumbnailUrl: x.coverAssetId ? this.urlsService.getAssetUrl(x.coverAssetId) : undefined,
      }))
  }))
}
