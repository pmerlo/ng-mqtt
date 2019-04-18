import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { MqttService, MqttMessage } from 'src/app/mqtt';

interface MessageEvent {
  timestamp: Date;
  topic: string;
  payload: string;
}

@Component({
  selector: 'app-subscribe',
  providers: [MqttService],
  templateUrl: './subscribe.component.html',
})
export class SubscribeComponent implements OnInit, OnDestroy {

  connected$: Observable<boolean>;

  topic = 'alpha/testing/hello';
  messages: MessageEvent[] = [];
  date: Date;

  private subscription = new Subscription();

  constructor(private mqttService: MqttService) { }

  ngOnInit() {
    this.connected$ = this.mqttService.connect();
  }

  ngOnDestroy() {
    this.mqttService.disconnect();
    this.subscription.unsubscribe();
  }

  subscribe() {
    this.subscription.add(
      this.mqttService
        .observeMessage(this.topic)
        .subscribe(msg => this.onMessage(msg))
    );
  }

  private onMessage(message: MqttMessage) {
    if (this.messages.length === 10) {
      this.messages.shift();
    }
    this.messages.push({
      timestamp: new Date(),
      ...message
    });
  }

}
