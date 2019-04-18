export interface MqttBrokerConfig {
  hostname: string;
  port: number;
  path: string;
}

export interface MqttMessage {
  topic: string;
  payload: string;
}
