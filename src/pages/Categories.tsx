import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Watch, 
  Camera, 
  Gamepad2,
  Home,
  Shirt
} from "lucide-react";
import { Link } from "react-router-dom";

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    {
      id: "electronics",
      name: "Electronics",
      icon: Smartphone,
      count: 124,
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500",
      subcategories: ["Smartphones", "Tablets", "Accessories"]
    },
    {
      id: "computers",
      name: "Computers & Laptops",
      icon: Laptop,
      count: 89,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
      subcategories: ["Laptops", "Desktops", "Components"]
    },
    {
      id: "audio",
      name: "Audio & Headphones",
      icon: Headphones,
      count: 156,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      subcategories: ["Headphones", "Speakers", "Earbuds"]
    },
    {
      id: "wearables",
      name: "Wearables",
      icon: Watch,
      count: 67,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      subcategories: ["Smart Watches", "Fitness Trackers", "Bands"]
    },
    {
      id: "cameras",
      name: "Cameras",
      icon: Camera,
      count: 43,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500",
      subcategories: ["DSLR", "Mirrorless", "Action Cameras"]
    },
    {
      id: "gaming",
      name: "Gaming",
      icon: Gamepad2,
      count: 78,
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500",
      subcategories: ["Consoles", "Games", "Accessories"]
    },
    {
      id: "home",
      name: "Home & Garden",
      icon: Home,
      count: 234,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
      subcategories: ["Furniture", "Decor", "Tools"]
    },
    {
      id: "fashion",
      name: "Fashion",
      icon: Shirt,
      count: 189,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500",
      subcategories: ["Clothing", "Shoes", "Accessories"]
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub => 
      sub.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gradient mb-4">Product Categories</h1>
          <p className="text-muted-foreground mb-6">Explore our wide range of products across different categories</p>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="card-premium group hover:shadow-elegant transition-all duration-300 cursor-pointer">
              <Link to={`/products?category=${category.id}`}>
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{category.count} items</Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <category.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="group-hover:text-primary transition-colors">
                      {category.name}
                    </span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Popular subcategories:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.map((sub) => (
                        <Badge key={sub} variant="outline" className="text-xs">
                          {sub}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Browse Products
                  </Button>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No categories found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;