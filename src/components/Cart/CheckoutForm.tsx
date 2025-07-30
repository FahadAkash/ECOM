import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/database';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CheckoutFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, onCancel }) => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !shippingAddress.trim()) return;

    setLoading(true);

    try {
      const orderItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        product: item.product
      }));

      await db.createOrder({
        userId: user.id,
        items: orderItems,
        total,
        shippingAddress
      });

      clearCart();
      onSuccess();
    } catch (error) {
      console.error('Order creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = total >= 1000 ? 0 : 60;
  const finalTotal = total + deliveryFee;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Order</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
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
                    ৳{item.product.price} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  ৳{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>৳{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery Fee:</span>
              <span>{deliveryFee === 0 ? 'Free' : `৳${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>৳{finalTotal.toFixed(2)}</span>
            </div>
          </div>
          
          {total >= 1000 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm font-medium">
                🎉 Free delivery on orders over ৳1000!
              </p>
            </div>
          )}
        </div>

        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Shipping Information</h3>
              
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={user?.name || ''}
                  disabled
                  className="bg-gray-50"
                />
                
                <Input
                  label="Mobile Number"
                  value={user?.mobile || ''}
                  disabled
                  className="bg-gray-50"
                />
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Shipping Address *
                  </label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your complete shipping address"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-black focus:ring-black"
                  />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    disabled
                    className="text-black focus:ring-black"
                  />
                  <div>
                    <p className="font-medium">Online Payment</p>
                    <p className="text-sm text-gray-600">Coming soon - bKash, Nagad, Cards</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                disabled={loading || !shippingAddress.trim()}
                className="flex-1"
              >
                {loading ? 'Processing...' : `Place Order - ৳${finalTotal.toFixed(2)}`}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};