import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate loading
    addToCart(product, quantity);
    setIsAdding(false);
    setQuantity(1);
  };

  const adjustQuantity = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-black text-white px-2 py-1 rounded-full text-xs font-medium">
          {product.stock} left
        </div>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-black transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-black">${product.price}</span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {product.stock > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => adjustQuantity(-1)}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-lg min-w-[2rem] text-center">{quantity}</span>
              <button
                onClick={() => adjustQuantity(1)}
                disabled={quantity >= product.stock}
                className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;