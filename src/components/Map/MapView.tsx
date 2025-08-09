import React from 'react';
import { MapContainer, TileLayer, Polyline, Circle, Tooltip } from 'react-leaflet';
import { GoogleMap, MarkerF, PolylineF, CircleF, useJsApiLoader } from '@react-google-maps/api';

type LatLng = { lat: number; lng: number };

interface MapViewProps {
  center: LatLng;
  store?: LatLng;
  destination?: LatLng;
  current?: LatLng;
  height?: number | string;
  zoom?: number;
}

export const MapView: React.FC<MapViewProps> = ({ center, store, destination, current, height = '100%', zoom = 14 }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  if (apiKey) {
    return <GoogleMapView center={center} store={store} destination={destination} current={current} height={height} zoom={zoom} apiKey={apiKey} />;
  }
  return <LeafletView center={center} store={store} destination={destination} current={current} height={height} zoom={zoom} />;
};

const GoogleMapView: React.FC<MapViewProps & { apiKey: string }> = ({ center, store, destination, current, height, zoom, apiKey }) => {
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey });
  if (!isLoaded) return <div style={{ height }} />;
  return (
    <div style={{ height }}>
      <GoogleMap center={center} zoom={zoom} mapContainerStyle={{ height: '100%', width: '100%' }} options={{ disableDefaultUI: true }}>
        {store && (
          <CircleF center={store} radius={60} options={{ strokeColor: '#000000' }} />
        )}
        {destination && (
          <CircleF center={destination} radius={60} options={{ strokeColor: '#16a34a' }} />
        )}
        {current && (
          <CircleF center={current} radius={50} options={{ strokeColor: '#2563eb' }} />
        )}
        {store && destination && (
          <PolylineF path={[store, destination]} options={{ strokeColor: '#6b7280', strokeOpacity: 0.7 }} />
        )}
      </GoogleMap>
    </div>
  );
};

const LeafletView: React.FC<MapViewProps> = ({ center, store, destination, current, height, zoom }) => {
  return (
    <div style={{ height }}>
      <MapContainer center={[center.lat, center.lng]} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {store && (
          <Circle center={[store.lat, store.lng]} radius={60} pathOptions={{ color: 'black' }}>
            <Tooltip>Store</Tooltip>
          </Circle>
        )}
        {destination && (
          <Circle center={[destination.lat, destination.lng]} radius={60} pathOptions={{ color: 'green' }}>
            <Tooltip>Destination</Tooltip>
          </Circle>
        )}
        {current && (
          <Circle center={[current.lat, current.lng]} radius={50} pathOptions={{ color: 'blue' }}>
            <Tooltip>Rider</Tooltip>
          </Circle>
        )}
        {store && destination && (
          <Polyline positions={[[store.lat, store.lng], [destination.lat, destination.lng]]} pathOptions={{ color: 'gray', dashArray: '6 6' }} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;


