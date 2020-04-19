import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneratorComponent } from './generator/generator.component';
import { FileDropDirective } from '../directives/file-drop.directive';
import { FileListComponent } from './file-list/file-list.component';
import { MapComponent } from './map/map.component';
import { LayerComponent } from './layer/layer.component';
import { SettingsComponent } from './settings/settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    GeneratorComponent,
    FileDropDirective,
    FileListComponent,
    MapComponent,
    LayerComponent,
    SettingsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
