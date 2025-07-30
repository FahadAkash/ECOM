import React from 'react';
import { ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { Product } from '../../types';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const { user } = useAuth();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (user && user.role === 'user') {
      addItem(product, 1);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-black">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {user?.role === 'admin' ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(product)}
                className="flex-1 flex items-center justify-center space-x-1"
              >
                <Edit size={16} />
                <span>Edit</span>
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete?.(product.id)}
                className="flex-1 flex items-center justify-center space-x-1"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </Button>
            </>
          ) : user?.role === 'user' ? (
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={18} />
              <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};