import { Routes } from '@angular/router';
import { AssetDetails, AssetView } from '@app/features/asset/pages'

export const ASSET_ROUTES: Routes = [
  {
    path: '',
    component: AssetDetails,
  },
  {
    path: 'view',
    component: AssetView,
  },
];
