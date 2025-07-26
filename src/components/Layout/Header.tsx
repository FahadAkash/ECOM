import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-black text-white sticky top-0 z-50 backdrop-blur-sm bg-black/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => handleViewChange('products')}
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
              <div className="w-4 h-4 bg-black rounded-sm"></div>
            </div>
            <span className="text-xl font-bold tracking-tight">ModernShop</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleViewChange('products')}
              className={`text-sm font-medium transition-colors duration-200 hover:text-gray-300 ${
                currentView === 'products' ? 'text-white border-b-2 border-white pb-1' : 'text-gray-400'
              }`}
            >
              Products
            </button>
            {user?.isAdmin && (
              <button
                onClick={() => handleViewChange('admin')}
                className={`text-sm font-medium transition-colors duration-200 hover:text-gray-300 ${
                  currentView === 'admin' ? 'text-white border-b-2 border-white pb-1' : 'text-gray-400'
                }`}
              >
                Admin Panel
              </button>
            )}
            {user && (
              <button
                onClick={() => handleViewChange('orders')}
                className={`text-sm font-medium transition-colors duration-200 hover:text-gray-300 ${
                  currentView === 'orders' ? 'text-white border-b-2 border-white pb-1' : 'text-gray-400'
                }`}
              >
                My Orders
              </button>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleViewChange('cart')}
                  className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user.name}</span>
                  <button
                    onClick={logout}
                    className="p-1 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleViewChange('auth')}
                className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 space-y-4">
            <button
              onClick={() => handleViewChange('products')}
              className="block w-full text-left text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              Products
            </button>
            {user?.isAdmin && (
              <button
                onClick={() => handleViewChange('admin')}
                className="block w-full text-left text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
              >
                Admin Panel
              </button>
            )}
            {user && (
              <button
                onClick={() => handleViewChange('orders')}
                className="block w-full text-left text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
              >
                My Orders
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;