import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PageComponent} from './page/page.component';

const routes: Routes = [
  {path: 'page', component: PageComponent},
  {path: '', redirectTo: 'page', pathMatch: 'full'},
  {path: '**', redirectTo: 'page'},
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
