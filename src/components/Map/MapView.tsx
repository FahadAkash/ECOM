import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline, Circle, Tooltip } from 'react-leaflet';
import { GoogleMap, PolylineF, CircleF, useJsApiLoader } from '@react-google-maps/api';

type LatLng = { lat: number; lng: number };

interface MapViewProps {
  center: LatLng;
  store?: LatLng;
  destination?: LatLng;
  current?: LatLng;
  // current viewer/user location (e.g., customer viewing tracking)
  user?: LatLng;
  height?: number | string;
  zoom?: number;
}

export const MapView: React.FC<MapViewProps> = ({ center, store, destination, current, user, height = '100%', zoom = 14 }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  if (apiKey) {
    return <GoogleMapView center={center} store={store} destination={destination} current={current} user={user} height={height} zoom={zoom} apiKey={apiKey} />;
  }
  return <LeafletView center={center} store={store} destination={destination} current={current} user={user} height={height} zoom={zoom} />;
};

// Relaxed typings to avoid strict prop mismatches across react-leaflet versions
type AnyProps = Record<string, unknown>;
const LMapContainer = MapContainer as unknown as React.FC<AnyProps>;
const LTileLayer = TileLayer as unknown as React.FC<AnyProps>;
const LCircle = Circle as unknown as React.FC<AnyProps>;
const LPolyline = Polyline as unknown as React.FC<AnyProps>;
const LTooltip = Tooltip as unknown as React.FC<AnyProps>;

const LeafletView: React.FC<MapViewProps> = ({ center, store, destination, current, user, height, zoom }) => {
  return (
    <div style={{ height }}>
      <LMapContainer center={[center.lat, center.lng]} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {store && (
          <LCircle center={[store.lat, store.lng]} radius={60} pathOptions={{ color: 'black' }}>
            <LTooltip>Store</LTooltip>
          </LCircle>
        )}
        {destination && (
          <LCircle center={[destination.lat, destination.lng]} radius={60} pathOptions={{ color: 'green' }}>
            <LTooltip>Destination</LTooltip>
          </LCircle>
        )}
        {current && (
          <LCircle center={[current.lat, current.lng]} radius={50} pathOptions={{ color: 'blue' }}>
            <LTooltip>Rider</LTooltip>
          </LCircle>
        )}
        {user && (
          <LCircle center={[user.lat, user.lng]} radius={50} pathOptions={{ color: 'orange' }}>
            <LTooltip>You</LTooltip>
          </LCircle>
        )}
        {store && destination && (
          <LPolyline positions={[[store.lat, store.lng], [destination.lat, destination.lng]]} pathOptions={{ color: 'gray', dashArray: '6 6' }} />
        )}
        {current && user && (
          <LPolyline positions={[[current.lat, current.lng], [user.lat, user.lng]]} pathOptions={{ color: 'red', weight: 3 }} />
        )}
      </LMapContainer>
    </div>
  );
};

const GoogleMapView: React.FC<MapViewProps & { apiKey: string }> = ({ center, store, destination, current, user, height, zoom, apiKey }) => {
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey, libraries: [] });
  // Fallback to Leaflet only if Google Maps fails to load
  if (loadError) {
    return <LeafletView center={center} store={store} destination={destination} current={current} user={user} height={height} zoom={zoom} />;
  }
  if (!isLoaded) return <div style={{ height }} />;
  return (
    <div style={{ height }}>
      <GoogleMap
        center={center}
        zoom={zoom}
        mapContainerStyle={{ height: '100%', width: '100%' }}
        options={{ disableDefaultUI: true, gestureHandling: 'greedy' }}
      >
        {store && (
          <CircleF center={store} radius={60} options={{ strokeColor: '#000000' }} />
        )}
        {destination && (
          <CircleF center={destination} radius={60} options={{ strokeColor: '#16a34a' }} />
        )}
        {current && (
          <CircleF center={current} radius={50} options={{ strokeColor: '#2563eb' }} />
        )}
        {user && (
          <CircleF center={user} radius={50} options={{ strokeColor: '#f59e0b' }} />
        )}
        {store && destination && (
          <PolylineF path={[store, destination]} options={{ strokeColor: '#6b7280', strokeOpacity: 0.7 }} />
        )}
        {current && user && (
          <PolylineF path={[current, user]} options={{ strokeColor: '#ef4444', strokeOpacity: 0.9, strokeWeight: 3 }} />
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;


