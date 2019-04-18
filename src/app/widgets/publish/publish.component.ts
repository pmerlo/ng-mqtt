import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { MqttService } from 'src/app/mqtt';

@Component({
  selector: 'app-publish',
  providers: [MqttService],
  templateUrl: './publish.component.html',
})
export class PublishComponent implements OnInit, OnDestroy {

  connected$: Observable<boolean>;

  topic = 'alpha/testing/hello';
  payload = 'world';

  constructor(private mqttService: MqttService) { }

  ngOnInit() {
    this.connected$ = this.mqttService.connect();
  }

  ngOnDestroy() {
    this.mqttService.disconnect();
  }

  publish() {
    this.mqttService.publish(this.topic, this.payload);
  }

}
