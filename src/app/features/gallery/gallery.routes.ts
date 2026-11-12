import { Routes } from '@angular/router';
import { Gallery, GallerySelect, Group } from './pages'

export const GALLERY_ROUTES: Routes = [
  {
    path: '',
    component: GallerySelect,
  },
  {
    path: 'gallery/:galleryName',
    component: Gallery,
  },
  {
    path: 'gallery/:galleryName/group/:id',
    component: Group,
  }
];
