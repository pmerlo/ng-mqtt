import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { MqttClient } from './mqtt-client';
import { MqttMessage, MqttBrokerConfig } from './models';
import { MQTT_BROKER_CONFIG } from './config';

@Injectable()
export class MqttService {

  private client: MqttClient;
  private _connected = new BehaviorSubject<boolean>(false);

  constructor(@Inject(MQTT_BROKER_CONFIG) private config: MqttBrokerConfig) { }

  connect(): Observable<boolean> {
    this.client = new MqttClient();

    this.client.connect$.subscribe(() => this._connected.next(true));
    this.client.end$.subscribe(() => this._connected.next(false));

    this.client.connect(this.config);

    return this._connected.asObservable();
  }

  disconnect() {
    this.client.disconnect();
  }

  publish(topic: string, payload: string, qos = 0, retain = false) {
    this.client.publish(topic, payload);
  }

  observeMessage(topic: string): Observable<MqttMessage> {
    this.client.subscribe(topic);

    return this.client.message$.pipe(
      filter(msg => topicMatchesFilter(msg.topic, topic))
    );
  }

}

function topicMatchesFilter(topic, topicFilter): boolean {
  const filterTokens = topicFilter.split('/');
  const topicTokens = topic.split('/');

  let index = 0;
  while (index < Math.min(filterTokens.length, topicTokens.length)) {
    const filterToken = filterTokens[index];
    const topicToken = topicTokens[index];
    index++;

    if (filterToken === '#') {
      return true;
    }

    if (filterToken === '+') {
      continue;
    }

    if (filterToken !== topicToken) {
      return false;
    }
  }

  return filterTokens.length === topicTokens.length;
}
