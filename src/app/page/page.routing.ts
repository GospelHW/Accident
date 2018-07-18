import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PageComponent} from './page.component';
import {PageStatComponent} from './stat/stat';
import {PageNewLettersComponent} from './new-letters/new-letters';
import {PageAccidentDetailComponent} from './accident-detail/accident-detail';
import {PageAccidentSubletComponent} from './accident-sublet/accident-sublet';

const routes: Routes = [{
  path: '',
  component: PageComponent,
  children: [
    {
      path: 'stat',
      component: PageStatComponent
    },
    {
      path: 'new',
      component: PageNewLettersComponent
    },
    {
      path: 'sublet',
      component: PageAccidentSubletComponent
    },
    {
      path: 'detail',
      component: PageAccidentDetailComponent
    },
    {
      path: '',
      redirectTo: 'stat',
      pathMatch: 'full'
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
