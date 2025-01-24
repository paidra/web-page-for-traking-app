import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { useMqttContext } from "../mqtt/MqttContext";
import "./MapView.css"; // Import CSS for styling
import { Icon } from "leaflet";

const con = new Icon({
  iconUrl:'src/assets/images/person.png',
  iconSize: [35, 35], // size of the icon
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});
// Component to dynamically update map view when location changes
const SetViewOnLocationChange: React.FC<{ lat: number; lng: number }> = ({
  lat,
  lng,
}) => {
  const map = useMap();

  useEffect(() => {
    const intervalId = setInterval(() => {
      map.setView([lat, lng], map.getZoom()); // Update map view to the new location
    }, 2000); // Update every 2 seconds

    // Cleanup interval when the component is unmounted or when the location changes
    return () => clearInterval(intervalId);
  }, [lat, lng, map]);

  return null;
};

const MapView: React.FC = () => {
  const { liveLocation } = useMqttContext();
  const [path, setPath] = useState<[number, number][]>([]); // State to store the path coordinates

  useEffect(() => {
    if (liveLocation && liveLocation.lat && liveLocation.lng) {
      setPath((prevPath) => {
        // If path is empty, start a new path
        if (prevPath.length === 0) {
          return [[liveLocation.lat, liveLocation.lng]];
        }
        // Otherwise, append the new location
        return [...prevPath, [liveLocation.lat, liveLocation.lng]];
      });
    }
  }, [liveLocation]);

  return (
    <div className="map-container">
      <MapContainer
        center={[34.739108680466394, 10.71023301460788]} // Default fallback center
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {liveLocation && (
          <>
            <Marker position={[liveLocation.lat, liveLocation.lng]} icon={con}>
              <Popup>
                Current Location: <br /> Latitude: {liveLocation.lat},
                Longitude: {liveLocation.lng}
              </Popup>
            </Marker>
            <SetViewOnLocationChange
              lat={liveLocation.lat}
              lng={liveLocation.lng}
            />
          </>
        )}
        {path.length > 1 && <Polyline positions={path} color="red" />}
      </MapContainer>
    </div>
  );
};

export default MapView;
