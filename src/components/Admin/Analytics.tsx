import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from 'lucide-react';
import { Order, Product } from '../../types';

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenueGrowth: 0,
    topProducts: [] as Array<{ product: Product; sales: number; revenue: number }>,
    ordersByStatus: {
      pending: 0,
      approved: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
    recentOrders: [] as Order[],
  });

  useEffect(() => {
    calculateAnalytics();
  }, []);

  const calculateAnalytics = () => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Basic totals
    const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.length;

    // Revenue growth (simulated - compare with previous period)
    const currentMonth = new Date().getMonth();
    const currentMonthOrders = orders.filter((order: Order) => 
      new Date(order.createdAt).getMonth() === currentMonth
    );
    const previousMonthOrders = orders.filter((order: Order) => 
      new Date(order.createdAt).getMonth() === currentMonth - 1
    );
    
    const currentRevenue = currentMonthOrders.reduce((sum: number, order: Order) => sum + order.total, 0);
    const previousRevenue = previousMonthOrders.reduce((sum: number, order: Order) => sum + order.total, 0);
    const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    // Top products
    const productSales: { [key: string]: { product: Product; sales: number; revenue: number } } = {};
    
    orders.forEach((order: Order) => {
      order.items.forEach(item => {
        if (!productSales[item.product.id]) {
          productSales[item.product.id] = {
            product: item.product,
            sales: 0,
            revenue: 0,
          };
        }
        productSales[item.product.id].sales += item.quantity;
        productSales[item.product.id].revenue += item.product.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Orders by status
    const ordersByStatus = orders.reduce((acc: any, order: Order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {
      pending: 0,
      approved: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    });

    // Recent orders
    const recentOrders = orders
      .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    setAnalytics({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      revenueGrowth,
      topProducts,
      ordersByStatus,
      recentOrders,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
              <div className="flex items-center mt-2">
                {analytics.revenueGrowth >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm">
                  {Math.abs(analytics.revenueGrowth).toFixed(1)}% vs last month
                </span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{analytics.totalOrders}</p>
              <p className="text-green-100 text-sm mt-2">All time</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Products</p>
              <p className="text-2xl font-bold">{analytics.totalProducts}</p>
              <p className="text-purple-100 text-sm mt-2">In catalog</p>
            </div>
            <Package className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{analytics.totalUsers}</p>
              <p className="text-orange-100 text-sm mt-2">Registered</p>
            </div>
            <Users className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {analytics.topProducts.map((item, index) => (
              <div key={item.product.id} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">{item.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${item.revenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Orders by Status</h3>
          <div className="space-y-4">
            {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'pending' ? 'bg-yellow-500' :
                    status === 'approved' ? 'bg-blue-500' :
                    status === 'shipped' ? 'bg-purple-500' :
                    status === 'delivered' ? 'bg-green-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="font-medium text-gray-900 capitalize">{status}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 text-sm text-gray-600">{order.shippingInfo.name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="py-3 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;