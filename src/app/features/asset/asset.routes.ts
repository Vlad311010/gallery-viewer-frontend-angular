import { Routes } from '@angular/router';
import { AssetDetails } from './components/asset-details/asset-details.component';
import { AssetView } from './components/asset-view/asset-view.component';

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
