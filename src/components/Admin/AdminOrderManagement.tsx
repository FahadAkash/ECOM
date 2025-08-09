import React, { useState } from 'react';
import { Order } from '../../types';
import { db } from '../../lib/database';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Package, Clock, CheckCircle, Truck, XCircle, MapPin } from 'lucide-react';

interface AdminOrderManagementProps {
  orders: Order[];
  onOrderUpdate: () => void;
}

export const AdminOrderManagement: React.FC<AdminOrderManagementProps> = ({
  orders,
  onOrderUpdate
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [trackingNumbers, setTrackingNumbers] = useState<Record<string, string>>({});

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      const trackingNumber = trackingNumbers[orderId];
      let trackingStatus = '';
      
      // Set appropriate tracking status based on order status
      switch (newStatus) {
        case 'approved':
          trackingStatus = 'Order Confirmed - Preparing for shipment';
          break;
        case 'processing':
          trackingStatus = 'Order is being prepared';
          break;
        case 'out_for_delivery':
          trackingStatus = 'Rider is on the way';
          break;
        case 'shipped':
          trackingStatus = 'Package shipped - In transit';
          break;
        case 'delivered':
          trackingStatus = 'Package delivered successfully';
          break;
        case 'cancelled':
          trackingStatus = 'Order cancelled';
          break;
      }
      
      await db.updateOrderStatus(orderId, newStatus, trackingNumber, trackingStatus);
      onOrderUpdate();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleTrackingNumberChange = (orderId: string, trackingNumber: string) => {
    setTrackingNumbers(prev => ({
      ...prev,
      [orderId]: trackingNumber
    }));
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'delivered':
        return <MapPin className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Order Management</h2>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label} ({option.value === 'all' ? orders.length : orders.filter(o => o.status === option.value).length})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(order.status)}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Order #{order.id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Updated: {new Date(order.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  order.status === 'approved' ? 'bg-green-100 text-green-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  ৳{order.total.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Order Items:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        ৳{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                <strong>Shipping Address:</strong>
              </p>
              <p className="text-sm text-gray-900">{order.shippingAddress}</p>
              
              {order.trackingNumber && (
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Tracking Number:</strong> {order.trackingNumber}
                </p>
              )}
              
              {order.trackingStatus && (
                <p className="text-sm text-blue-600 mt-1 font-medium">
                  <strong>Status:</strong> {order.trackingStatus}
                </p>
              )}
            </div>

            {(order.status === 'approved' || order.status === 'processing') && (
              <div className="mb-4">
                <Input
                  label="Tracking Number"
                  placeholder="Enter tracking number (e.g., DHL123456789)"
                  value={trackingNumbers[order.id] || order.trackingNumber || ''}
                  onChange={(e) => handleTrackingNumberChange(order.id, e.target.value)}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {order.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(order.id, 'approved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve Order
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                  >
                    Cancel Order
                  </Button>
                </>
              )}

              {order.status === 'approved' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(order.id, 'processing')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Start Processing
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                  >
                    Cancel Order
                  </Button>
                </>
              )}

              {order.status === 'processing' && (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(order.id, 'shipped')}
                    disabled={!trackingNumbers[order.id]?.trim() && !order.trackingNumber}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Mark as Shipped
                  </Button>
                  <Button
                    size="sm"
                    onClick={async () => {
                      const rider = { id: 'rider-1', name: 'QuickRider', phone: '+8801XXXXXXXXX' };
                      await db.startExpressDelivery(order.id, rider, 10);
                      onOrderUpdate();
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Start 10-min Delivery
                  </Button>
                </div>
              )}

              {order.status === 'shipped' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(order.id, 'delivered')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark as Delivered
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400">
            {selectedStatus === 'all' 
              ? 'No orders have been placed yet' 
              : `No ${selectedStatus} orders found`}
          </p>
        </div>
      )}
    </div>
  );
};