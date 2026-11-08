import { Component, inject, Signal } from '@angular/core';
import { RequestState, toRequestStateOnceWithTransoformation } from '@app/shared/utils/request-state';
import { ApiUrls, GalleryService } from '@contract/index';
import { DisplayError } from '@app/shared/pages/display-error/error-message.component';
import { NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

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
  apiUrls = inject(ApiUrls);

  private readonly galleriesState : Signal<RequestState<GalleryThumbnail[] | undefined>> = toRequestStateOnceWithTransoformation(
    this.galleryService.galleries(),
    (response) => (
      response?.map<GalleryThumbnail>(x => ({
        id: x.id,
        name: x.name,
        thumbnailUrl: x.coverAssetId ? this.apiUrls.getAssetUrl(x.coverAssetId) : undefined,
      }))
    ),
    { errorMessage: "Unable to load galleries"}
  )
 
}
