import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneratorComponent } from './generator/generator.component';
import { FileDropDirective } from '../directives/file-drop.directive';
import { FileListComponent } from './file-list/file-list.component';
import { MapComponent } from './map/map.component';
import { LayerComponent } from './layer/layer.component';

@NgModule({
  declarations: [
    AppComponent,
    GeneratorComponent,
    FileDropDirective,
    FileListComponent,
    MapComponent,
    LayerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
