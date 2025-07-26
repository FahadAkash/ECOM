import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  created_at: string;
}

interface Shipment {
  id: string;
  tracking_number: string;
  carrier: string;
  status: string;
  current_location: string;
  estimated_delivery: string;
}

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId && user) {
      fetchOrderDetails();
    }
  }, [orderId, user]);

  const fetchOrderDetails = async () => {
    try {
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user?.id)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Fetch shipment details
      const { data: shipmentData, error: shipmentError } = await supabase
        .from('shipments')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (shipmentError) throw shipmentError;
      setShipment(shipmentData);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order not found</h2>
          <Link to="/orders" className="text-blue-600 hover:text-blue-700">
            View your orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been received.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number</span>
                <span className="font-semibold">#{order.id.slice(-8).toUpperCase()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date</span>
                <span className="font-semibold">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-semibold text-blue-600">
                  ${order.total_amount.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </h3>
              <div className="text-gray-600">
                <p>{order.shipping_address}</p>
                <p>{order.shipping_city}, {order.shipping_postal_code}</p>
                <p>{order.shipping_country}</p>
              </div>
            </div>
          </div>

          {/* Tracking Information */}
          {shipment && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Tracking Number</p>
                    <p className="text-blue-600 font-mono">{shipment.tracking_number}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Carrier</p>
                    <p className="text-gray-600">{shipment.carrier}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Current Location</p>
                    <p className="text-gray-600">{shipment.current_location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Estimated Delivery</p>
                    <p className="text-gray-600">
                      {new Date(shipment.estimated_delivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-blue-900">
                    Status: {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Your order is being processed and will be shipped soon.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            View All Orders
          </Link>
          <Link
            to="/products"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Continue Shopping
          </Link>
          {shipment && (
            <Link
              to={`/track/${shipment.tracking_number}`}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              Track Package
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;