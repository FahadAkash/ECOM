import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Layout/Header';
import { HomePage } from './components/Home/HomePage';
import { AuthModal } from './components/Auth/AuthModal';
import { CartSidebar } from './components/Cart/CartSidebar';
import { CheckoutForm } from './components/Cart/CheckoutForm';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { UserDashboard } from './components/User/UserDashboard';
import { RiderDashboard } from './components/Rider/RiderDashboard';
import { Modal } from './components/ui/Modal';
import { ChatWidget } from './components/Chat/ChatWidget';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    setShowCart(false);
    alert('Order placed successfully! You can track it in your orders section.');
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setCurrentView('dashboard');
  };

  const handleHomeClick = () => {
    if (user) {
      setCurrentView(currentView === 'home' ? 'dashboard' : 'home');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCartClick={() => setShowCart(true)}
        onAuthClick={() => setShowAuthModal(true)}
        onHomeClick={handleHomeClick}
      />

      <main>
        {!user || currentView === 'home' ? (
          <HomePage onAuthClick={() => setShowAuthModal(true)} />
        ) : (
          user.role === 'admin' ? (
            <AdminDashboard />
          ) : user.role === 'rider' ? (
            <RiderDashboard />
          ) : (
            <UserDashboard />
          )
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={() => {
          setShowCart(false);
          setShowCheckout(true);
        }}
      />

      <Modal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="Checkout"
      >
        <CheckoutForm
          onSuccess={handleCheckoutSuccess}
          onCancel={() => setShowCheckout(false)}
        />
      </Modal>

      <ChatWidget />
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