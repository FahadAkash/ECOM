import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Heart, 
  ShoppingCart, 
  User,
  MapPin,
  Truck,
  Clock,
  CheckCircle,
  Eye,
  Star,
  Download,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Demo data
  useEffect(() => {
    const demoOrders = [
      {
        id: "ORD-001",
        date: "2024-01-15",
        status: "delivered",
        total: 299,
        items: [
          {
            name: "Premium Wireless Headphones",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
            price: 299,
            quantity: 1
          }
        ],
        tracking: {
          status: "delivered",
          location: "Your Address",
          estimatedDelivery: "2024-01-16",
          updates: [
            { status: "Order Placed", date: "2024-01-15 09:00", completed: true },
            { status: "Processing", date: "2024-01-15 14:00", completed: true },
            { status: "Shipped", date: "2024-01-15 18:00", completed: true },
            { status: "Out for Delivery", date: "2024-01-16 08:00", completed: true },
            { status: "Delivered", date: "2024-01-16 15:30", completed: true }
          ]
        }
      },
      {
        id: "ORD-002",
        date: "2024-01-14",
        status: "shipped",
        total: 199,
        items: [
          {
            name: "Smart Fitness Watch",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
            price: 199,
            quantity: 1
          }
        ],
        tracking: {
          status: "in_transit",
          location: "Distribution Center - Chicago",
          estimatedDelivery: "2024-01-17",
          updates: [
            { status: "Order Placed", date: "2024-01-14 10:30", completed: true },
            { status: "Processing", date: "2024-01-14 16:00", completed: true },
            { status: "Shipped", date: "2024-01-15 09:00", completed: true },
            { status: "Out for Delivery", date: "2024-01-17 08:00", completed: false },
            { status: "Delivered", date: "2024-01-17 16:00", completed: false }
          ]
        }
      },
      {
        id: "ORD-003",
        date: "2024-01-13",
        status: "processing",
        total: 89,
        items: [
          {
            name: "Designer Laptop Backpack",
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300",
            price: 89,
            quantity: 1
          }
        ],
        tracking: {
          status: "processing",
          location: "Fulfillment Center",
          estimatedDelivery: "2024-01-18",
          updates: [
            { status: "Order Placed", date: "2024-01-13 11:15", completed: true },
            { status: "Processing", date: "2024-01-13 15:00", completed: true },
            { status: "Shipped", date: "2024-01-16 10:00", completed: false },
            { status: "Out for Delivery", date: "2024-01-18 08:00", completed: false },
            { status: "Delivered", date: "2024-01-18 16:00", completed: false }
          ]
        }
      }
    ];

    const demoWishlist = [
      {
        id: "1",
        name: "Professional Camera",
        price: 899,
        originalPrice: 1099,
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300",
        inStock: true,
        rating: 4.9
      },
      {
        id: "2",
        name: "Luxury Handbag",
        price: 159,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300",
        inStock: false,
        rating: 4.5
      }
    ];

    setOrders(demoOrders);
    setWishlist(demoWishlist);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-success text-success-foreground';
      case 'shipped':
        return 'bg-primary text-primary-foreground';
      case 'processing':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTrackingIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return CheckCircle;
      case 'in_transit':
        return Truck;
      case 'processing':
        return Clock;
      default:
        return Package;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">My Dashboard</h1>
              <p className="text-muted-foreground">Track your orders and manage your account</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/profile">
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="premium">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="card-premium">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-gradient-primary rounded-lg w-fit mx-auto mb-3">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold mb-1">{orders.length}</div>
              <div className="text-muted-foreground">Total Orders</div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-gradient-primary rounded-lg w-fit mx-auto mb-3">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold mb-1">{wishlist.length}</div>
              <div className="text-muted-foreground">Wishlist Items</div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-gradient-primary rounded-lg w-fit mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold mb-1">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-muted-foreground">Delivered</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="tracking">Order Tracking</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="card-premium">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold">{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          Ordered on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">${order.total}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-muted-foreground">
                              Qty: {item.quantity} × ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4 mr-2" />
                          Write Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <div className="space-y-6">
              {orders.map((order) => {
                const TrackingIcon = getTrackingIcon(order.tracking.status);
                
                return (
                  <Card key={order.id} className="card-premium">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Order {order.id}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Current Status */}
                      <div className="flex items-center space-x-4 p-4 bg-gradient-secondary rounded-lg">
                        <div className="p-3 bg-gradient-primary rounded-lg">
                          <TrackingIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Current Status</h4>
                          <p className="text-muted-foreground">{order.tracking.location}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            Est. {new Date(order.tracking.estimatedDelivery).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Tracking Timeline */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Tracking History</h4>
                        <div className="space-y-3">
                          {order.tracking.updates.map((update, index) => (
                            <div key={index} className="flex items-center space-x-4">
                              <div className={`w-3 h-3 rounded-full ${
                                update.completed ? 'bg-success' : 'bg-muted'
                              }`} />
                              <div className="flex-1">
                                <div className={`font-medium ${
                                  update.completed ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {update.status}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {update.date}
                                </div>
                              </div>
                              {update.completed && (
                                <CheckCircle className="h-4 w-4 text-success" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-medium mb-1">Delivery Address</h4>
                          <p className="text-muted-foreground">
                            123 Main Street<br />
                            Apartment 4B<br />
                            New York, NY 10001
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            {wishlist.length === 0 ? (
              <Card className="card-premium">
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-6">
                    Start adding items you love to your wishlist
                  </p>
                  <Link to="/products">
                    <Button variant="premium">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Browse Products
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <Card key={item.id} className="card-premium group">
                    <CardContent className="p-0">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 space-y-3">
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">${item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(item.rating)
                                  ? 'fill-warning text-warning'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            ({item.rating})
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="premium"
                            size="sm"
                            className="flex-1"
                            disabled={!item.inStock}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4 fill-destructive text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;