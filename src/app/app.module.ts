import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as Mat from '@angular/material';

import { AppComponent } from './app.component';
import * as Widgets from './widgets';
import { MQTT_BROKER_CONFIG } from './mqtt';

const Material = [
  Mat.MatButtonModule,
  Mat.MatCardModule,
  Mat.MatCheckboxModule,
  Mat.MatChipsModule,
  Mat.MatDialogModule,
  Mat.MatDividerModule,
  Mat.MatFormFieldModule,
  Mat.MatIconModule,
  Mat.MatInputModule,
  Mat.MatListModule,
  Mat.MatMenuModule,
  Mat.MatPaginatorModule,
  Mat.MatProgressSpinnerModule,
  Mat.MatRadioModule,
  Mat.MatSelectModule,
  Mat.MatSidenavModule,
  Mat.MatSlideToggleModule,
  Mat.MatSnackBarModule,
  Mat.MatSortModule,
  Mat.MatStepperModule,
  Mat.MatTableModule,
  Mat.MatTabsModule,
  Mat.MatToolbarModule,
  Mat.MatTooltipModule,
  Mat.MatMenuModule
];

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
    ...Material
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
