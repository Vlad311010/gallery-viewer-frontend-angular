import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'gallery',
    pathMatch: 'full',
  },
  {
    path: 'gallery/:galleryName/asset/:assetId',
    loadChildren: () =>
      import('@app/features/asset/asset.routes')
        .then(m => m.ASSET_ROUTES),
  },
  {
    path: 'gallery',
    loadChildren: () =>
      import('@app/features/gallery/gallery.routes')
        .then(m => m.GALLERY_ROUTES),
  }
];
