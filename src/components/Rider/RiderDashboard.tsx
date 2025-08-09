import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/database';
import { Order } from '../../types';
import MapView from '../Map/MapView';
import { Button } from '../ui/Button';

export const RiderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const load = async () => {
    const all = await db.getAllOrders();
    const assigned = all.filter(o => o.rider?.id === user?.id || (o.rider?.id === 'rider-1' && user?.role === 'rider'));
    setOrders(assigned);
  };

  useEffect(() => {
    load();
  }, [user]);

  useEffect(() => {
    if (!activeOrder) return;
    const unsub = db.subscribeToOrder(activeOrder.id, (o) => setActiveOrder(o));
    return () => unsub();
  }, [activeOrder?.id]);

  const startGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported');
      return;
    }
    navigator.geolocation.watchPosition(async (pos) => {
      if (activeOrder) {
        await db.updateOrderLocation(activeOrder.id, pos.coords.latitude, pos.coords.longitude);
      }
    }, (err) => setGeoError(err.message), { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Rider Dashboard</h1>
        <p className="text-gray-600">See assigned deliveries and share your live location</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className={`p-4 rounded border ${activeOrder?.id === o.id ? 'border-black' : 'border-gray-200'} bg-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Order #{o.id.slice(-6)}</div>
                  <div className="text-sm text-gray-600">{o.trackingStatus}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setActiveOrder(o)}>View</Button>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-gray-600">No assigned orders</div>
          )}
        </div>
        <div className="lg:col-span-2">
          {activeOrder ? (
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold">Order #{activeOrder.id.slice(-6)}</div>
                  <div className="text-sm text-gray-600">Destination: {activeOrder.shippingAddress}</div>
                </div>
                <Button onClick={startGeolocation}>Share Live Location</Button>
              </div>
              {geoError && <div className="text-red-600 text-sm mb-2">{geoError}</div>}
              <div className="h-96 rounded overflow-hidden border">
                <MapView
                  center={activeOrder.currentLocation ?? activeOrder.storeLocation ?? { lat: 23.78, lng: 90.28 }}
                  store={activeOrder.storeLocation}
                  destination={activeOrder.destinationLocation}
                  current={activeOrder.currentLocation}
                />
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => db.updateOrderStatus(activeOrder.id, 'delivered', activeOrder.trackingNumber, 'Delivered')}>Mark Delivered</Button>
              </div>
            </div>
          ) : (
            <div className="text-gray-600">Select an order to view details</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;


