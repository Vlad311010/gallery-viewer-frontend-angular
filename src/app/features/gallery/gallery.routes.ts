import { Routes } from '@angular/router';
import { GalleryList } from './components/gallery-list/gallery.component';
import { Group } from './components/group/group.component';
import { GallerySelect } from './components/gallery-select/gallery-select.component';

export const GALLERY_ROUTES: Routes = [
  {
    path: '',
    component: GallerySelect,
  },
  {
    path: 'gallery/:galleryName',
    component: GalleryList,
  },
  {
    path: 'gallery/:galleryName/group/:id',
    component: Group,
  }
];
