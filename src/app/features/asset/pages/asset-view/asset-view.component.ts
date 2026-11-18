import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ApiUrlsService, MediaService } from '@contract/index';
import { lastValueFrom } from 'rxjs';
import { DisplayError } from '@app/shared/pages/display-error/error-message.component';
import { IsVideoPipe } from '@shared/pipes/is-video';
import { AssetViewImage, AssetViewVideo } from '@app/features/asset/components'

@Component({
  selector: 'asset-view',
  templateUrl: './asset-view.component.html',
  imports: [AssetViewImage, DisplayError, IsVideoPipe, AssetViewVideo],
})
export class AssetView {
  assetId = input.required<number, string>({ transform: (value) => numberAttribute(value) });

  private readonly urlsService = inject(ApiUrlsService);
  private readonly mediaService = inject(MediaService);
  
  protected assetUrl = computed(() => this.urlsService.getAssetUrl(this.assetId()));

  private readonly assetMimeTypeQuery = injectQuery(() => ({
    queryKey: [
      MediaService.name,
      ...this.urlsService.getAssetQueryKey(this.assetId())
    ],
    queryFn: () => {
      return lastValueFrom(this.mediaService.assetHead(this.assetId()));
    }
  }))
}

