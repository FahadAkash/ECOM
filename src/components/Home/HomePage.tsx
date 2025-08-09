import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Truck, Shield, Star, Package, Users, Award } from 'lucide-react';
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

      {/* Features Section */}
      <motion.section 
        ref={refs.features}
        initial="hidden"
        animate={inView.features ? "visible" : "hidden"}
        variants={staggerContainer}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Deshi10?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ultra‑fast 10‑minute delivery, curated products, and cash on delivery. Made for Bangladesh.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={scaleUp}
                  className="group text-center p-8 rounded-xl border border-gray-200 hover:border-cyan-400 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-cyan-500 transition-colors duration-300">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        ref={refs.stats}
        initial="hidden"
        animate={inView.stats ? "visible" : "hidden"}
        variants={staggerContainer}
        className="py-20 bg-gray-900 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={index} 
                  className="text-center"
                  variants={fadeIn}
                >
                  <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-12 h-12 text-cyan-400" />
                  </div>
                  <div className="text-5xl font-bold mb-2 text-cyan-400">{stat.value}</div>
                  <div className="text-gray-300 text-lg">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  variants={scaleUp}
                  className="overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
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

      {/* CTA removed for compact homepage */}

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