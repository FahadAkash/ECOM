import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, MapPin, Truck, Clock } from "lucide-react";

const OrderConfirmation = () => {
  const location = useLocation();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Get order data from navigation state or create demo order
    const orderData = location.state?.order || {
      id: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      total: 597,
      items: [
        {
          id: "1",
          name: "Premium Wireless Headphones",
          price: 299,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
        },
        {
          id: "2",
          name: "Smart Fitness Watch",
          price: 199,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
        }
      ],
      shippingAddress: {
        name: "John Doe",
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zip: "10001"
      },
      estimatedDelivery: "3-5 business days",
      trackingNumber: "TRK" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      status: "confirmed"
    };
    setOrder(orderData);
  }, [location.state]);

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const trackingSteps = [
    { status: "confirmed", label: "Order Confirmed", icon: CheckCircle, completed: true },
    { status: "processing", label: "Processing", icon: Package, completed: false },
    { status: "shipped", label: "Shipped", icon: Truck, completed: false },
    { status: "delivered", label: "Delivered", icon: MapPin, completed: false }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-success-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for your purchase. Your order has been received.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Order Number:</span>
                <Badge variant="secondary">{order.id}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-lg font-bold">${order.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Tracking Number:</span>
                <Badge>{order.trackingNumber}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Estimated Delivery:</span>
                <span>{order.estimatedDelivery}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="card-premium mt-8">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tracking Progress */}
        <Card className="card-premium mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Order Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackingSteps.map((step, index) => (
                <div key={step.status} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                  </div>
                  {step.completed && (
                    <Badge className="bg-success text-success-foreground">Completed</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild className="flex-1">
            <Link to="/dashboard">View Order History</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;