import { EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';
import * as mqtt from 'mqtt';

import { MqttMessage, MqttBrokerConfig } from './models';

declare type Qos = 0 | 1 | 2;

interface Packet {
  cmd: string;
  dup: boolean;
  length: number;
  payload: any;
  qos: Qos;
  retain: boolean;
  topic: string;
}

interface Connack extends Packet {
  returnCode: number;
  sessionPresent: boolean;
}

interface Suback {
  qos: Qos;
  topic: string;
}

export class MqttClient {

  private clientId: string;

  connect$: Observable<Connack>;
  reconnect$: Observable<any>;
  close$: Observable<any>;
  offline$: Observable<any>;
  error$: Observable<any>;
  end$: Observable<any>;
  message$: Observable<MqttMessage>;
  packetsend$: Observable<any>;
  packetreceive$: Observable<any>;

  private client: any;

  private _connect = new EventEmitter<Connack>();
  private _reconnect = new EventEmitter();
  private _close = new EventEmitter();
  private _offline = new EventEmitter();
  private _error = new EventEmitter();
  private _end = new EventEmitter();
  private _message = new EventEmitter<MqttMessage>();
  private _packetsend = new EventEmitter();
  private _packetreceive = new EventEmitter();

  constructor() {
    this.clientId = generateClientId();

    this.connect$ = this._connect.asObservable();
    this.reconnect$ = this._reconnect.asObservable();
    this.close$ = this._close.asObservable();
    this.offline$ = this._offline.asObservable();
    this.error$ = this._error.asObservable();
    this.end$ = this._end.asObservable();
    this.message$ = this._message.asObservable();
    this.packetsend$ = this._packetsend.asObservable();
    this.packetreceive$ = this._packetreceive.asObservable();
  }

  connect(config: MqttBrokerConfig) {
    this.client = mqtt.connect(`ws://${config.hostname}:${config.port}${config.path}`, {
      clientId: this.clientId
    });

    this.client.on('connect', this.onConnect);
    this.client.on('reconnect', this.onReconnect);
    this.client.on('close', this.onClose);
    this.client.on('offline', this.onOffline);
    this.client.on('error', this.onError);
    this.client.on('end', this.onEnd);
    this.client.on('message', this.onMessage);
    this.client.on('packetsend', this.onPacketsend);
    this.client.on('packetreceive', this.onPacketreceive);
  }

  private onConnect = (connack: Connack) => {
    logCall('onConnect', connack);
    this._connect.emit(connack);
  }

  private onReconnect = () => {
    logCall('onReconnect');
    this._reconnect.emit();
  }

  private onClose = () => {
    logCall('onClose');
    this._close.emit();
  }

  private onOffline = () => {
    logCall('onOffline');
    this._offline.emit();
  }

  private onError = (error: any) => {
    logCall('onError', error);
    this._error.emit(error);
  }

  private onEnd = () => {
    logCall('onEnd');
    this._end.emit();
  }

  private onMessage = (topic: any, message: any, packet: any) => {
    logCall('onMessage', topic, message, packet);
    this._message.emit({
      topic: topic,
      payload: message
    });
  }

  private onPacketsend = (packet: any) => {
    logCall('onPacketsend', packet);
    this._packetsend.emit(packet);
  }

  private onPacketreceive = (packet: any) => {
    logCall('onPacketreceive', packet);
    this._packetreceive.emit(packet);
  }

  disconnect() {
    const force = false;
    const options = {};
    this.client.end(); // passing a callback seems to produce an error
  }

  publish(topic: string, message: string) {
    const options = {};
    this.client.publish(topic, message, options, this.onPublish);
  }

  private onPublish = (err: any) => {
    logCall('onPublish', err);
  }

  subscribe(topic: string) {
    const options = {};
    this.client.subscribe(topic, options, this.onSubscribe);
  }

  private onSubscribe = (err: any, granted: Suback[]) => {
    logCall('onSubscribe', err, granted);
  }

}

function generateClientId(): string {
  return Date.now() + '_' + Math.random().toString(16).substr(2, 8);
}

function logCall(method: string, ...args: any[]) {
  // console.log(`MqttClient # ${method}`);
  // args.forEach(arg => console.log(arg));
  // console.log('---');
}
