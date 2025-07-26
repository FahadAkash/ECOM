import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Star, 
  ArrowRight,
  Users,
  ShoppingBag,
  Award,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Demo featured products
  useEffect(() => {
    const demoProducts = [
      {
        id: "1",
        name: "Premium Wireless Headphones",
        price: 299,
        originalPrice: 399,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        rating: 4.8,
        reviews: 124,
        category: "Electronics",
        inStock: true,
        isNew: true,
        isOnSale: true,
        status: "approved" as const
      },
      {
        id: "2", 
        name: "Designer Laptop Backpack",
        price: 89,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        rating: 4.6,
        reviews: 89,
        category: "Accessories",
        inStock: true,
        isNew: false,
        isOnSale: false,
        status: "approved" as const
      },
      {
        id: "3",
        name: "Smart Fitness Watch",
        price: 199,
        originalPrice: 249,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        rating: 4.7,
        reviews: 156,
        category: "Wearables",
        inStock: true,
        isNew: true,
        isOnSale: true,
        status: "approved" as const
      },
      {
        id: "4",
        name: "Minimalist Office Chair",
        price: 399,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
        rating: 4.9,
        reviews: 67,
        category: "Furniture",
        inStock: false,
        isNew: false,
        isOnSale: false,
        status: "approved" as const
      }
    ];
    setFeaturedProducts(demoProducts);
  }, []);

  const stats = [
    { icon: Users, value: "50K+", label: "Happy Customers" },
    { icon: ShoppingBag, value: "100K+", label: "Products Sold" },
    { icon: Award, value: "4.9", label: "Customer Rating" },
    { icon: Zap, value: "24/7", label: "Support" }
  ];

  const categories = [
    { name: "Electronics", count: 1250, image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300" },
    { name: "Fashion", count: 890, image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300" },
    { name: "Home & Garden", count: 567, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300" },
    { name: "Sports", count: 423, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-16 bg-gradient-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 group-hover:shadow-glow transition-all duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <Badge variant="secondary">Trending</Badge>
              </div>
              <h2 className="text-3xl font-bold text-gradient">Featured Products</h2>
              <p className="text-muted-foreground mt-2">Discover our most popular items</p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/categories/${category.name.toLowerCase()}`}
                className="group block"
              >
                <div className="card-premium p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-square rounded-xl overflow-hidden mb-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {category.count} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card-hero p-12">
            <Star className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Subscribe to our newsletter and be the first to know about new products, 
              special offers, and exclusive deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              <Button variant="premium" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;