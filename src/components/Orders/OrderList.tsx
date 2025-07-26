import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Order } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const OrderList: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = allOrders.filter((order: Order) => order.userId === user.id);
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600">Your order history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg p-6">
              {/* Order Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-bold text-lg">{order.id}</p>
                  {order.trackingNumber && (
                    <>
                      <p className="text-sm text-gray-600 mt-2">Tracking Number</p>
                      <p className="font-medium">{order.trackingNumber}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Items Ordered</h4>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Price: ${item.product.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="mb-4 lg:mb-0">
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingInfo.name}<br />
                      {order.shippingInfo.address}<br />
                      {order.shippingInfo.city}, {order.shippingInfo.zipCode}<br />
                      {order.shippingInfo.phone}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="space-y-2">
                      <div className="flex justify-between lg:justify-end lg:space-x-8">
                        <span className="text-gray-600">Order Total:</span>
                        <span className="font-bold text-xl">${order.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between lg:justify-end lg:space-x-8">
                        <span className="text-sm text-gray-600">Ordered on:</span>
                        <span className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status Progress */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center space-x-2 ${
                    ['pending', 'approved', 'shipped', 'delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      order.status !== 'cancelled' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm font-medium">Order Placed</span>
                  </div>

                  <div className={`flex items-center space-x-2 ${
                    ['approved', 'shipped', 'delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      ['approved', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm font-medium">Approved</span>
                  </div>

                  <div className={`flex items-center space-x-2 ${
                    ['shipped', 'delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      ['shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm font-medium">Shipped</span>
                  </div>

                  <div className={`flex items-center space-x-2 ${
                    order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm font-medium">Delivered</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderList;