import { useMqtt } from "./mqtt/useMqtt";
import "./App.css";
import MapView from "./components/MapView";

function App() {
  const {
    client,
    isConnected,
    mqttConnect,
    mqttDisconnect,
  } = useMqtt();


  const handleConnect = () => {
    if (isConnected) {
      mqttDisconnect();
    } else {
      mqttConnect();
    }
  };
  
  return (
    <>
      <div className="card">
        <p>MQTT auto connects on init.</p>
        <p className="mqtt">
          Client is{" "}
          {isConnected ? (
            <>
              <span>connected</span> with id{" "}
              <span>{client?.options.clientId}</span>
            </>
          ) : (
            "disconnected"
          )}
        </p>
        <button onClick={handleConnect}>
          {isConnected ? "Disconnect" : "Connect"}
        </button>
      </div>

      <div>
        <h1>Live Location Map</h1>
        <MapView />
      </div>
    </>
  );
}

export default App;
