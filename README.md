# React + TypeScript + Vite + MQTT

Esto es una app de ejemplo que acompaña a [este post en mi blog](https://rubenvara.io/react/integrar-mqtt-react/).

Partiendo de la plantilla base de Vite + TypeScript + React, lo convertimos en un **cliente MQTT** usando la librería [MQTT.js](https://github.com/mqttjs/MQTT.js).

## Cómo usar

1. Puedes clonar este repo.
2. Después instalar las dependencias: `npm install`.
3. Crea un archivo `.env` en la raíz. Aquí tendrás que añadir la url de tu broker con la clave `VITE_BACKEND_MQTT` (más info abajo).
4. Después iniciar la app en desarrollo: `npm run dev`.

Listo, podrás ver la pantalla principal de la app para:

- Conectar/desconectar el cliente.
- Suscribirte/desuscribirte a un topic.
- Publicar un mensaje en un topic.

Abre la consola del navegador para ver los mensajes publicados en los topics a los que estés suscrito.

### Broker

Recuerda que, para que esto funcione, necesitas un _broker_ al que conectar. Yo suelo usar [mosquitto](https://mosquitto.org/).

En el archivo `./.env`, añade la siguiente clave:

```env
VITE_BACKEND_MQTT="url de tu broker"
# ejemplo:
# VITE_BACKEND_MQTT="ws://localhost:9001/mqtt"
```

## Editar

El contexto que gestiona la conexión está en `./src/mqtt/MqttContext.tsx`.

El hook que expone los métodos en `./src/mqtt/useMqtt.ts`.

Toda la lógica de botones y formularios está en `./src/App.tsx`.
