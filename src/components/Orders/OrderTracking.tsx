import React from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Order } from '../../types';

interface OrderTrackingProps {
  order: Order;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  const trackingSteps = [
    { status: 'pending', label: 'Order Placed', icon: Package, description: 'Your order has been received' },
    { status: 'approved', label: 'Order Confirmed', icon: CheckCircle, description: 'Order confirmed and being prepared' },
    { status: 'processing', label: 'Preparing', icon: Clock, description: 'Your order is being prepared for shipment' },
    { status: 'shipped', label: 'Shipped', icon: Truck, description: 'Your order is on the way' },
    { status: 'delivered', label: 'Delivered', icon: MapPin, description: 'Order delivered successfully' }
  ];

  const getCurrentStepIndex = () => {
    const statusOrder = ['pending', 'approved', 'processing', 'shipped', 'delivered'];
    return statusOrder.indexOf(order.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Tracking</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Order #{order.id.slice(-8)}</span>
          {order.trackingNumber && (
            <span>Tracking: {order.trackingNumber}</span>
          )}
        </div>
      </div>

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
                {stepStatus === 'current' && order.trackingStatus && (
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {order.trackingStatus}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {order.status === 'delivered' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-700 font-medium">Order Delivered Successfully!</span>
          </div>
          <p className="text-green-600 text-sm mt-1">
            Delivered on {new Date(order.updatedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <Package className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 font-medium">Order Cancelled</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            This order was cancelled on {new Date(order.updatedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};