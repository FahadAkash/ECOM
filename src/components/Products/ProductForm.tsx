import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ProductFormProps {
  product?: Product;
  onSubmit: (productData: Partial<Product>) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        category: product.category,
        stock: product.stock.toString()
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image,
      category: formData.category,
      stock: parseInt(formData.stock)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Product Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Enter product name"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="Enter product description"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price ($)"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
          placeholder="0.00"
        />

        <Input
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          required
          placeholder="0"
        />
      </div>

      <Input
        label="Image URL"
        name="image"
        type="url"
        value={formData.image}
        onChange={handleChange}
        required
        placeholder="https://example.com/image.jpg"
      />

      <Input
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        placeholder="Electronics, Fashion, etc."
      />

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};