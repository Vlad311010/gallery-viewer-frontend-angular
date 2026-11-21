import { Routes } from '@angular/router';
import { TagCreate, TagsList } from '@app/features/tag/pages'

export const ASSET_ROUTES: Routes = [
  
  {
    path: '',
    component: TagsList,
  },
  {
    path: 'create',
    component: TagCreate,
  }
];
