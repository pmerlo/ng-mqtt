import { InjectionToken } from '@angular/core';
import { MqttBrokerConfig } from './models';

export const MQTT_BROKER_CONFIG = new InjectionToken<MqttBrokerConfig>('MqttBrokerConfig');
