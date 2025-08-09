import React from 'react';
import { ShoppingCart, User, Package, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../ui/Button';

interface HeaderProps {
  onCartClick: () => void;
  onAuthClick: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartClick, onAuthClick, onHomeClick }) => {
  const { user, logout } = useAuth();
  const { items } = useCart();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onHomeClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Package className="w-8 h-8 text-black" />
              <h1 className="text-2xl font-extrabold tracking-tight">
                <span className="text-black">Deshi</span>
                <span className="text-green-600">10</span>
              </h1>
            </button>
            
            {user && (
              <button
                onClick={onHomeClick}
                className="flex items-center space-x-1 text-gray-600 hover:text-black transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="hidden sm:block text-sm text-gray-600">Hi, <span className="font-medium">{user.name}</span></div>
                {user.role === 'user' && (
                  <button
                    onClick={onCartClick}
                    className="relative p-2 text-gray-600 hover:text-black transition-colors"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onAuthClick}
                className="flex items-center space-x-1 rounded-full"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};