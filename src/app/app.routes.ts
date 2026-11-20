import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'gallery/:galleryName/asset/:assetId',
    loadChildren: () =>
      import('@app/features/asset/asset.routes')
        .then(m => m.ASSET_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('@app/features/gallery/gallery.routes')
        .then(m => m.GALLERY_ROUTES),
  },
  {
    path: 'tags',
    loadChildren: () => 
      import('@app/features/tag/tag.routes')
        .then(m => m.ASSET_ROUTES)      
  }
];
