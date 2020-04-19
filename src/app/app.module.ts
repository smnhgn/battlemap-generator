import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneratorComponent } from './generator/generator.component';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { FileDropDirective } from '../directives/file-drop.directive';

@NgModule({
  declarations: [
    AppComponent,
    GeneratorComponent,
    DropzoneComponent,
    FileDropDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
