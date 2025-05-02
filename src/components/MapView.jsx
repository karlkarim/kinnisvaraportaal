import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';

function MapCenterUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center]);

  return null;
}

function MapView({ center }) {
  return (
    <MapContainer
  center={center}
  zoom={13}
  scrollWheelZoom={false}
  style={{ height: "100%", width: "100%", zIndex: 0 }}
>

  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
  />
  <Marker position={center}>
    <Popup>Valitud piirkond</Popup>
  </Marker>
</MapContainer>
  );
}

export default MapView;
