import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Zap, Shield, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const features = [
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Same day delivery in major cities"
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "256-bit SSL encryption"
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $50"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-accent/30 to-background">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--primary))_1px,transparent_0)] [background-size:24px_24px] opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-accent rounded-full text-sm font-medium text-accent-foreground">
                <Zap className="h-4 w-4 mr-2 text-primary" />
                New Collection Available
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Discover Amazing{" "}
                <span className="text-hero-gradient">Products</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                Shop the latest trends with our curated collection of premium products. 
                Fast shipping, secure payments, and exceptional customer service.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button variant="hero" size="xl" className="group">
                  <ShoppingBag className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Shop Now
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/categories">
                <Button variant="outline" size="xl">
                  Browse Categories
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <div className="p-2 bg-gradient-primary rounded-lg group-hover:shadow-glow transition-all duration-300">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hero rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-card rounded-3xl p-8 shadow-xl border border-border/50 backdrop-blur-sm">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center shadow-glow">
                    <ShoppingBag className="h-16 w-16 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gradient">Premium Shopping</h3>
                    <p className="text-muted-foreground">Experience luxury retail</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                50% OFF
              </div>
              <div className="absolute -bottom-4 -left-4 bg-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                Free Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;