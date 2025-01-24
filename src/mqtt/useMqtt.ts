import { useMqttContext } from "./MqttContext";
const MQTT_TOPIC = "live/location";

// all functions are reusable
export function useMqtt() {
  const { client, isConnected, setIsConnected, mqttConnect } = useMqttContext();

  // desconectar
  const mqttDisconnect = async () => {
    if (isConnected && client) {
      try {
        await client.endAsync();

        setIsConnected(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // suscribir. el topic se pasa como parámetro
  async function mqttSubscribe() {
    if (isConnected && client) {
      try {
        await client.subscribeAsync(MQTT_TOPIC, {
          qos: 0,
          rap: false,
          rh: 0,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  // desuscribir
  async function mqttUnSubscribe(topic: string) {
    if (isConnected && client) {
      try {
        await client.unsubscribeAsync(topic);
      } catch (err) {
        console.error(err);
      }
    }
  }

  // publicar mensaje
  async function mqttPublish(
    topic: string,
    message: string | number | boolean
  ) {
    if (client && isConnected) {
      try {
        await client.publishAsync(topic, JSON.stringify(message), {
          qos: 1,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  return {
    client,
    isConnected,
    mqttConnect,
    mqttDisconnect,
    mqttPublish,
    mqttSubscribe,
    mqttUnSubscribe,
  };
}
