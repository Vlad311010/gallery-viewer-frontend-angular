import { Routes } from '@angular/router';
import { GalleryList } from './components/gallery-list/gallery-list.component';
import { Group } from './components/group/group.component';
// import { GalleryList } from '@app/features/gallery';

export const GALLERY_ROUTES: Routes = [
  {
    path: '',
    component: GalleryList,
  },
  {
    path: 'group/:id',
    component: Group,
  }
];
