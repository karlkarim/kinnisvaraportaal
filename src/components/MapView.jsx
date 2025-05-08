import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import geoRegions from "../data/geoRegions";

function MapCenterUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);

  return null;
}

function MapView({ regionName }) {
  const region = geoRegions.find(r => r.name === regionName);

  if (!region) {
    return <p>Kaardiandmed puuduvad piirkonna "{regionName}" kohta.</p>;
  }

  const center = region.center;

  return (
    <div className="h-96 rounded overflow-hidden">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%", zIndex: 0 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        />
        <MapCenterUpdater center={center} />
        <Marker position={center}>
          <Popup>{region.name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapView;
