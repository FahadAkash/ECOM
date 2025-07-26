import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const { toast } = useToast();

  // Demo data
  useEffect(() => {
    const demoProducts = [
      {
        id: "1",
        name: "Premium Wireless Headphones",
        price: 299,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        rating: 4.8,
        reviews: 124,
        category: "Electronics",
        inStock: true,
        status: "pending" as const
      },
      {
        id: "2",
        name: "Smart Fitness Watch",
        price: 199,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        rating: 4.7,
        reviews: 156,
        category: "Wearables",
        inStock: true,
        status: "approved" as const
      },
      {
        id: "3",
        name: "Professional Camera",
        price: 899,
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500",
        rating: 4.9,
        reviews: 203,
        category: "Electronics",
        inStock: true,
        status: "rejected" as const
      }
    ];

    const demoOrders = [
      {
        id: "ORD-001",
        customer: "John Doe",
        email: "john@example.com",
        total: 599,
        status: "processing",
        items: 2,
        date: "2024-01-15",
        shippingStatus: "preparing"
      },
      {
        id: "ORD-002",
        customer: "Jane Smith",
        email: "jane@example.com",
        total: 199,
        status: "shipped",
        items: 1,
        date: "2024-01-14",
        shippingStatus: "in_transit"
      },
      {
        id: "ORD-003",
        customer: "Mike Johnson",
        email: "mike@example.com",
        total: 899,
        status: "delivered",
        items: 3,
        date: "2024-01-13",
        shippingStatus: "delivered"
      }
    ];

    setProducts(demoProducts);
    setOrders(demoOrders);
  }, []);

  const handleApproveProduct = (productId: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, status: "approved" as const }
        : product
    ));
    toast({
      title: "Product Approved",
      description: "The product has been approved and is now live.",
    });
  };

  const handleRejectProduct = (productId: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, status: "rejected" as const }
        : product
    ));
    toast({
      title: "Product Rejected",
      description: "The product has been rejected and hidden from customers.",
      variant: "destructive",
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, shippingStatus: newStatus }
        : order
    ));
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status updated to ${newStatus}.`,
    });
  };

  const stats = [
    {
      title: "Total Revenue",
      value: "$24,580",
      icon: DollarSign,
      change: "+12.5%",
      positive: true
    },
    {
      title: "Total Orders",
      value: "156",
      icon: ShoppingCart,
      change: "+8.2%",
      positive: true
    },
    {
      title: "Total Products",
      value: "89",
      icon: Package,
      change: "+3.1%",
      positive: true
    },
    {
      title: "Active Users",
      value: "2,340",
      icon: Users,
      change: "+15.3%",
      positive: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      case 'processing':
        return 'bg-warning text-warning-foreground';
      case 'shipped':
        return 'bg-primary text-primary-foreground';
      case 'delivered':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getShippingStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'bg-warning text-warning-foreground';
      case 'in_transit':
        return 'bg-primary text-primary-foreground';
      case 'delivered':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your e-commerce store</p>
            </div>
            <Link to="/admin/add-product">
              <Button variant="premium" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm flex items-center ${
                      stat.positive ? 'text-success' : 'text-destructive'
                    }`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-primary rounded-lg">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {products.filter(p => p.status === 'pending').length} Pending
                </Badge>
                <Badge className="bg-success text-success-foreground">
                  {products.filter(p => p.status === 'approved').length} Approved
                </Badge>
                <Badge variant="destructive">
                  {products.filter(p => p.status === 'rejected').length} Rejected
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdmin={true}
                  onApprove={handleApproveProduct}
                  onReject={handleRejectProduct}
                />
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold">Order Management</h2>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="card-premium">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h3 className="text-lg font-semibold">{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <Badge className={getShippingStatusColor(order.shippingStatus)}>
                            {order.shippingStatus.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          <span className="font-medium">{order.customer}</span> • {order.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items} items • ${order.total} • {order.date}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <select
                          value={order.shippingStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-3 py-1 border border-border rounded-md bg-background text-sm"
                        >
                          <option value="preparing">Preparing</option>
                          <option value="in_transit">In Transit</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-lg">
                    <p className="text-muted-foreground">Sales chart would go here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-premium">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 3).map((product, index) => (
                      <div key={product.id} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-primary text-white flex items-center justify-center font-bold">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">${product.price}</p>
                        </div>
                        <Badge variant="secondary">{product.reviews} sales</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;