import { Routes } from '@angular/router';
import { GalleryList } from './components/gallery-list/gallery.component';
import { Group } from './components/group/group.component';

export const GALLERY_ROUTES: Routes = [
  {
    path: ':galleryName',
    component: GalleryList,
  },
  {
    path: ':galleryName/group/:id',
    component: Group,
  }
];
