import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { MqttService } from 'src/app/mqtt';

@Component({
  selector: 'app-connection',
  providers: [MqttService],
  templateUrl: './connection.component.html',
})
export class ConnectionComponent implements OnInit {

  connected$: Observable<boolean>;

  hostname = '192.168.5.217';
  port = 1884;
  clientId = 'abc';

  constructor(private mqttService: MqttService) { }

  ngOnInit() { }

  connect() {
    this.connected$ = this.mqttService.connect();
  }

  disconnect() {
    this.mqttService.disconnect();
  }

}
