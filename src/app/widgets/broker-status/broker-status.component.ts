import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Observable, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { MqttService, MqttMessage } from 'src/app/mqtt';

interface BrokerStatus {
  name: string;
  topic: string;
}

interface BrokerStatusObservable extends BrokerStatus {
  value$: Observable<string>;
}

const statusList: BrokerStatus[] = [
  {
    name: 'version',
    topic: '$SYS/broker/version'
  },
  {
    name: 'uptime',
    topic: '$SYS/broker/uptime'
  },
  {
    name: 'clients',
    topic: '$SYS/broker/clients/total'
  },
  {
    name: 'bytes sent',
    topic: '$SYS/broker/bytes/sent'
  },
  {
    name: 'bytes received',
    topic: '$SYS/broker/bytes/received'
  },
  {
    name: 'messages sent',
    topic: '$SYS/broker/messages/sent'
  },
  {
    name: 'messages received',
    topic: '$SYS/broker/messages/received'
  }
];

@Component({
  selector: 'app-broker-status',
  providers: [MqttService],
  templateUrl: './broker-status.component.html',
})
export class BrokerStatusComponent implements OnInit, OnDestroy {

  displayedColumns = ['name', 'value'];
  dataSource = new MatTableDataSource<BrokerStatusObservable>();
  statusMessages: BrokerStatusObservable[] = [];

  private subscription = new Subscription();

  constructor(private mqttService: MqttService) { }

  ngOnInit() {
    this.subscription.add(
      this.mqttService
        .connect()
        .subscribe(connected => connected ? this.observeBrokerStatus() : this.initTable())
    );
  }

  ngOnDestroy() {
    this.mqttService.disconnect();
    this.subscription.unsubscribe();
  }

  private initTable() {
    statusList.forEach(status => {
      this.statusMessages.push({
        ...status,
        value$: of('n/a')
      });
    });

    this.dataSource.data = this.statusMessages;
  }

  private observeBrokerStatus() {
    this.statusMessages.map(item => {
      const value$ = this.mqttService
        .observeMessage(item.topic)
        .pipe(map((message: MqttMessage) => message.payload));

      item.value$ = value$;
      return item;
    });
  }

}
