import React, { useEffect, useMemo, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Bike } from 'lucide-react';
import { Order } from '../../types';
import { db } from '../../lib/database';
import { MapContainer, TileLayer, Polyline, Circle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface OrderTrackingProps {
  order: Order;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  const [liveOrder, setLiveOrder] = useState<Order>(order);

  useEffect(() => {
    setLiveOrder(order);
    const unsubscribe = db.subscribeToOrder(order.id, (o) => setLiveOrder(o));
    return () => unsubscribe();
  }, [order.id]);

  const trackingSteps = [
    { status: 'pending', label: 'Order Placed', icon: Package, description: 'Your order has been received' },
    { status: 'approved', label: 'Order Confirmed', icon: CheckCircle, description: 'Order confirmed and being prepared' },
    { status: 'processing', label: 'Preparing', icon: Clock, description: 'Your order is being prepared for shipment' },
    { status: 'out_for_delivery', label: 'Out for Delivery', icon: Bike, description: 'Rider is on the way to you' },
    { status: 'shipped', label: 'Shipped', icon: Truck, description: 'Your order is on the way' },
    { status: 'delivered', label: 'Delivered', icon: MapPin, description: 'Order delivered successfully' }
  ];

  const getCurrentStepIndex = () => {
    const statusOrder = ['pending', 'approved', 'processing', 'out_for_delivery', 'shipped', 'delivered'];
    return statusOrder.indexOf(liveOrder.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const etaText = useMemo(() => {
    if (!liveOrder.promisedDeliveryAt) return null;
    const ms = new Date(liveOrder.promisedDeliveryAt).getTime() - Date.now();
    if (ms <= 0) return 'Arriving now';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }, [liveOrder.promisedDeliveryAt, liveOrder.updatedAt]);

  const showLiveMap = liveOrder.status === 'out_for_delivery' || (liveOrder.currentLocation && liveOrder.status !== 'delivered');
  const centerLatLng: [number, number] | null = liveOrder.currentLocation
    ? [liveOrder.currentLocation.lat, liveOrder.currentLocation.lng]
    : liveOrder.storeLocation
      ? [liveOrder.storeLocation.lat, liveOrder.storeLocation.lng]
      : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Tracking</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Order #{liveOrder.id.slice(-8)}</span>
          {liveOrder.trackingNumber && (
            <span>Tracking: {liveOrder.trackingNumber}</span>
          )}
        </div>
      </div>

      {showLiveMap && centerLatLng && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-700">
              {liveOrder.trackingStatus || 'Rider is on the way'}
            </div>
            {etaText && (
              <div className="text-sm font-semibold text-blue-700">
                ETA: {etaText}
              </div>
            )}
          </div>
          <div className="h-72 rounded overflow-hidden border">
            <MapContainer center={centerLatLng} zoom={14} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
              {liveOrder.storeLocation && (
                <Circle center={[liveOrder.storeLocation.lat, liveOrder.storeLocation.lng]} radius={60} pathOptions={{ color: 'black' }}>
                  <Tooltip>Store</Tooltip>
                </Circle>
              )}
              {liveOrder.destinationLocation && (
                <Circle center={[liveOrder.destinationLocation.lat, liveOrder.destinationLocation.lng]} radius={60} pathOptions={{ color: 'green' }}>
                  <Tooltip>Destination</Tooltip>
                </Circle>
              )}
              {liveOrder.currentLocation && (
                <Circle center={[liveOrder.currentLocation.lat, liveOrder.currentLocation.lng]} radius={50} pathOptions={{ color: 'blue' }}>
                  <Tooltip>Rider location</Tooltip>
                </Circle>
              )}
              {liveOrder.storeLocation && liveOrder.destinationLocation && (
                <Polyline positions={[[liveOrder.storeLocation.lat, liveOrder.storeLocation.lng], [liveOrder.destinationLocation.lat, liveOrder.destinationLocation.lng]]} pathOptions={{ color: 'gray', dashArray: '6 6' }} />
              )}
            </MapContainer>
          </div>
          {liveOrder.rider && (
            <div className="mt-3 text-sm text-gray-700">
              Rider: <span className="font-medium">{liveOrder.rider.name}</span> · {liveOrder.rider.phone}
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {trackingSteps.map((step, index) => {
          const Icon = step.icon;
          const stepStatus = getStepStatus(index);
          
          return (
            <div key={step.status} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${stepStatus === 'completed' ? 'bg-green-500 text-white' : 
                    stepStatus === 'current' ? 'bg-blue-500 text-white' : 
                    'bg-gray-200 text-gray-400'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium ${
                    stepStatus === 'completed' ? 'text-green-700' :
                    stepStatus === 'current' ? 'text-blue-700' :
                    'text-gray-500'
                  }`}>
                    {step.label}
                  </h4>
                  {stepStatus === 'current' && (
                    <span className="text-xs text-blue-600 font-medium">Current</span>
                  )}
                  {stepStatus === 'completed' && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                {stepStatus === 'current' && liveOrder.trackingStatus && (
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {liveOrder.trackingStatus}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {liveOrder.status === 'delivered' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-700 font-medium">Order Delivered Successfully!</span>
          </div>
          <p className="text-green-600 text-sm mt-1">
            Delivered on {new Date(liveOrder.updatedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {liveOrder.status === 'cancelled' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <Package className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 font-medium">Order Cancelled</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            This order was cancelled on {new Date(liveOrder.updatedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};