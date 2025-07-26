import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import AuthForm from './components/Auth/AuthForm';
import ProductList from './components/Products/ProductList';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import OrderList from './components/Orders/OrderList';
import AdminPanel from './components/Admin/AdminPanel';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('products');

  if (!user && currentView !== 'auth') {
    setCurrentView('auth');
  }

  if (!user) {
    return <AuthForm setCurrentView={setCurrentView} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      {currentView === 'products' && <ProductList />}
      {currentView === 'cart' && <Cart setCurrentView={setCurrentView} />}
      {currentView === 'checkout' && <Checkout setCurrentView={setCurrentView} />}
      {currentView === 'orders' && <OrderList />}
      {currentView === 'admin' && user.isAdmin && <AdminPanel />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;