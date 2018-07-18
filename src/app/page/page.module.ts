import { NgModule } from '@angular/core';
import {PageComponent} from './page.component';
import {PagesRoutingModule} from './page.routing';
import {PageStatComponent} from './stat/stat';
import {PageNewLettersComponent} from './new-letters/new-letters';
import {PageAccidentSubletComponent} from './accident-sublet/accident-sublet';
import {PageAccidentDetailComponent} from './accident-detail/accident-detail';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap';

@NgModule({
  declarations: [
    PageComponent,
    PageStatComponent,
    PageNewLettersComponent,
    PageAccidentSubletComponent,
    PageAccidentDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    PagesRoutingModule,
  ],
  providers: [],
})
export class PageModule { }
