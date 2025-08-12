import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Truck, Shield, Star, Package, Users, Award, Search } from 'lucide-react';
import { Product } from '../../types';
import { db } from '../../lib/database';
import { ProductCard } from '../Products/ProductCard';
import { Button } from '../ui/Button';
import { motion, useInView } from 'framer-motion';

interface HomePageProps {
  onAuthClick: () => void;
}

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring" as const, 
      stiffness: 300,
      damping: 20
    }
  }
};

export const HomePage: React.FC<HomePageProps> = ({ onAuthClick }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const refs = {
    hero: useRef(null),
    features: useRef(null),
    stats: useRef(null),
    products: useRef(null),
    cta: useRef(null)
  };
  
  const inView = {
    hero: useInView(refs.hero, { once: true, margin: "-100px" }),
    features: useInView(refs.features, { once: true, margin: "-50px" }),
    stats: useInView(refs.stats, { once: true }),
    products: useInView(refs.products, { once: true, margin: "-50px" }),
    cta: useInView(refs.cta, { once: true })
  };

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await db.getProducts();
      setFeaturedProducts(products.slice(0, 6));
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Free shipping on orders over ৳1000'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'Your payment information is safe'
    },
    {
      icon: Star,
      title: 'Quality Products',
      description: 'Curated selection of premium items'
    }
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Happy Customers' },
    { icon: Package, value: '50K+', label: 'Products Delivered' },
    { icon: Award, value: '99%', label: 'Customer Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero removed to show products immediately like Daraz */}

      {/* Search bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in DeshiBazar"
              className="w-full border rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </div>

      {/* Featured Products at top */}
      <motion.section 
        ref={refs.products}
        initial="hidden"
        animate={inView.products ? "visible" : "hidden"}
        variants={staggerContainer}
        className="py-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Flash Deals · 10‑Minute Delivery</h2>
            <p className="text-gray-600">Shop popular items right now</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts
                .filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()))
                .map((product) => (
                <motion.div 
                  key={product.id} 
                  variants={scaleUp}
                  className="overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -10 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button onClick={onAuthClick} className="rounded-full">Sign in to buy</Button>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Deshi10 moved to bottom */}
      <motion.section 
        ref={refs.features}
        initial="hidden"
        animate={inView.features ? "visible" : "hidden"}
        variants={staggerContainer}
        className="py-16 bg-white border-t"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            variants={fadeIn}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Choose DeshiBazar?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ultra‑fast 10‑minute delivery, curated products, and cash on delivery. Made for Bangladesh.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={scaleUp}
                  className="group text-center p-6 rounded-xl border border-gray-200 hover:border-green-500 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors duration-300">
                    <Icon className="w-9 h-9 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <button
          onClick={onAuthClick}
          className="bg-cyan-500 text-white rounded-full p-4 shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-all"
          aria-label="Start shopping"
        >
          <ShoppingBag className="w-6 h-6" />
        </button>
      </motion.div>
    </div>
  );
};