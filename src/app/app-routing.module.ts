import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneratorComponent } from './generator/generator.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'generator'
  },
  {
    path: 'generator',
    component: GeneratorComponent
  },
  {
    path: '**',
    redirectTo: 'generator'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
