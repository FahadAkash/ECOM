import React from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Order } from '../../types';

interface OrderListProps {
  orders: Order[];
  showUserInfo?: boolean;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, showUserInfo = false }) => {
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <Package className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(order.status)}
              <div>
                <h3 className="font-semibold text-gray-900">
                  Order #{order.id.slice(-8)}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 text-sm">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1">
                  <span className="text-gray-900">{item.product.name}</span>
                  <span className="text-gray-600 ml-2">× {item.quantity}</span>
                </div>
                <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Shipping Address:</strong> {order.shippingAddress}
            </p>
            {order.trackingNumber && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Tracking Number:</strong> {order.trackingNumber}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};