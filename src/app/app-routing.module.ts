import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CharsComponent } from './chars/chars.component';
import { CharComponent } from './char/char.component';

const routes: Routes = [
  {
    path: 'chars',
    component: CharsComponent,
    data: { animation: 'CharsPage' }
  },
  {
    path: 'char',
    component: CharComponent,
    data: { animation: 'CharPage' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
