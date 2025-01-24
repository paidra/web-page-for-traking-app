import mqtt from "mqtt";
import React, { createContext, useCallback, useEffect, useState } from "react";
import queryString from "query-string";

// tipo del contexto
type MqttContextType = {
  client: mqtt.MqttClient | null;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  mqttConnect: () => void;
  liveLocation: { lat: number; lng: number };
};

// contenido por defecto del contexto
const defaultContext: MqttContextType = {
  client: null,
  isConnected: false,
  setIsConnected: () => {},
  mqttConnect: () => {},
  liveLocation: { lat: 0, lng: 0 },
};

// el contexto
const MqttContext = createContext<MqttContextType>(defaultContext);

// exportamos un custom hook
// eslint-disable-next-line react-refresh/only-export-components
export const useMqttContext = () => {
  return React.useContext(MqttContext);
};

// función auxiliar (no la mejor forma de crear ids únicos)
const getClientId = () => `test_client_${Math.random().toString(16).slice(3)}`;

// vamos con el provider
export const MqttProvider = ({ children }: React.PropsWithChildren) => {
  const [client, setClient] = useState<MqttContextType["client"]>(
    defaultContext.client
  );
  const [isConnected, setIsConnected] = useState(defaultContext.isConnected);
  const [liveLocation, setLiveLocation] = useState(defaultContext.liveLocation);

  // función para conectar
  const mqttConnect = useCallback(() => {
    const mqttClient = mqtt.connect(
      "wss://your mqtt broker with port :8884/mqtt",
      {
        protocolVersion: 5,
        // ... otras opciones que quieras añadir
        clientId: getClientId(),
        username: "ur name",
        password: "ur password",
      }
    );

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttClient.subscribe("moveit", (err) => {
        if (!err) {
          console.log("Subscribed to moveit topic");
        }
      });
    });

    mqttClient.on("message", (topic, message) => {
      if (topic === "moveit") {
        try {
          const parsedMessage = queryString.parse(message.toString(), {
            parseBooleans: true,
            parseNumbers: true,
          });
          setLiveLocation({
            lat: (parsedMessage.lat as number) || 0,
            lng: (parsedMessage.lng as number) || 0,
          });
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      }
    });

    setClient(mqttClient);
  }, []);

  // observar eventos
  useEffect(() => {
    if (client) {
      // cuando se conecta
      client.on("connect", () => {
        if (client.connected) setIsConnected(true);
      });
      // cuando hay error
      client.on("error", (err) => {
        console.error(err);
        client.end();

        setIsConnected(false);
      });
      // cuando se reconecta
      client.on("reconnect", () => {
        if (client.connected) setIsConnected(true);
      });
      // cuando se desconecta
      client.on("close", () => {
        setIsConnected(false);
      });
      // cuando se recibe un packet de desconexión desde el broker
      client.on("disconnect", () => {
        setIsConnected(false);
      });
    }

    // cleanup
    return () => {
      if (client) {
        client.endAsync();
        setIsConnected(false);
      }
    };
  }, [client]);

  // auto conectar al inicializar el contexto
  useEffect(() => {
    if (!client && !isConnected) mqttConnect();
  }, [client, isConnected, mqttConnect]);

  const contextValue = React.useMemo(
    () => ({
      client,
      isConnected,
      setIsConnected,
      mqttConnect,
      liveLocation,
    }),
    [client, isConnected, mqttConnect, liveLocation]
  );

  return (
    <MqttContext.Provider value={contextValue}>{children}</MqttContext.Provider>
  );
};
