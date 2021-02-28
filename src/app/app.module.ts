import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import * as Widgets from './widgets';
import { MQTT_BROKER_CONFIG } from './mqtt';

@NgModule({
  declarations: [
    AppComponent,
    Widgets.ConnectionComponent,
    Widgets.PublishComponent,
    Widgets.SubscribeComponent,
    Widgets.BrokerStatusComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
  ],
  providers: [
    {
      provide: MQTT_BROKER_CONFIG,
      useValue: {
        hostname: 'localhost',
        port: 80,
        path: '/mqtt'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
