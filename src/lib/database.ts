export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  username: string;
  mobile: string;
  address?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  trackingNumber?: string;
  trackingStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

class DatabaseManager {
  private static instance: DatabaseManager;

  private constructor() {
    this.initializeDatabase();
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private initializeDatabase() {
    this.createTables();
    this.seedData();
  }

  private createTables() {
    if (!localStorage.getItem('deshideal_initialized')) {
      localStorage.setItem('deshideal_initialized', 'true');
      localStorage.setItem('deshideal_users', JSON.stringify([]));
      localStorage.setItem('deshideal_products', JSON.stringify([]));
      localStorage.setItem('deshideal_orders', JSON.stringify([]));
    }
  }

  private seedData() {
    const users = JSON.parse(localStorage.getItem('deshideal_users') || '[]');
    if (users.length === 0) {
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@deshideal.com',
        password: 'admin123',
        name: 'Admin User',
        username: 'admin',
        mobile: '+880-1234-567890',
        address: 'Dhaka, Bangladesh',
        role: 'admin',
        createdAt: new Date().toISOString()
      };

      const demoUser: User = {
        id: 'user-1',
        email: 'user@deshideal.com',
        password: 'user123',
        name: 'Demo User',
        username: 'demouser',
        mobile: '+880-9876-543210',
        address: 'Chittagong, Bangladesh',
        role: 'user',
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('deshideal_users', JSON.stringify([adminUser, demoUser]));

      const demoProducts: Product[] = [
        {
          id: 'prod-1',
          name: 'Premium Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.',
          price: 10,
          image: 'https://primebazar.com/public/uploads/all/rPb83zyZGckxypLvImDWxfAK2FV9xDLv36kputo5.webp',
          category: 'Electronics',
          stock: 50,
          createdAt: new Date().toISOString()
        },
        {
          id: 'prod-2',
          name: 'Smart Watch Pro',
          description: 'Advanced smartwatch with health monitoring, GPS tracking, and long battery life. Stay connected and healthy.',
          price: 20,
          image: 'https://rukminim2.flixcart.com/image/704/844/xif0q/smartwatch/w/x/y/45-new-t800-ultra-men-smartwatch-02-android-ios-syncronex-yes-original-imah3zvuashefyzv.jpeg?q=90&crop=false',
          category: 'Electronics',
          stock: 30,
          createdAt: new Date().toISOString()
        },
        {
          id: 'prod-3',
          name: 'Designer Backpack',
          description: 'Stylish and functional backpack perfect for work, travel, or daily use. Made with premium materials.',
          price: 1299,
          image: 'https://kroyshop.com/wp-content/uploads/2023/07/IMG-0816-600x600.jpg',
          category: 'Fashion',
          stock: 100,
          createdAt: new Date().toISOString()
        },
        {
          id: 'prod-4',
          name: 'Smartphone Pro Max',
          description: 'Latest flagship smartphone with advanced camera system, powerful processor, and stunning display.',
          price: 89999,
          image: 'https://w0.peakpx.com/wallpaper/962/500/HD-wallpaper-smartphone-bangladesh-brand-phone-symphony-technology.jpg',
          category: 'Electronics',
          stock: 25,
          createdAt: new Date().toISOString()
        },
        {
          id: 'prod-5',
          name: 'Casual T-Shirt',
          description: 'Comfortable cotton t-shirt perfect for everyday wear. Available in multiple colors and sizes.',
          price: 599,
          image: 'https://tanbinas.com/uslive/pfism/4616img2022_01_31_120122_63468266.webp',
          category: 'Fashion',
          stock: 200,
          createdAt: new Date().toISOString()
        },
        {
          id: 'prod-6',
          name: 'Gaming Laptop',
          description: 'High-performance gaming laptop with dedicated graphics card and fast processor for ultimate gaming experience.',
          price: 125999,
          image: 'https://i.rtings.com/assets/pages/6dRuEBex/best-gaming-laptops-20242028-medium.jpg?format=auto',
          category: 'Electronics',
          stock: 15,
          createdAt: new Date().toISOString()
        } ,
        {
          id: 'prod-7',
          name: 'DIU BUS',
          description: 'If anyone wants to take the DIU bus for free, they can take it — including the driver.',
          price: 0.00,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZMWzoZHm_TC0nOOG6w_1YE87P__44FCoy6A&s',
          category: 'Garbage',
          stock: 75,
          createdAt: new Date().toISOString()
        }
      ];

      localStorage.setItem('deshideal_products', JSON.stringify(demoProducts));
    }
  }

  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const users = JSON.parse(localStorage.getItem('deshideal_users') || '[]');
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('deshideal_users', JSON.stringify(users));
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = JSON.parse(localStorage.getItem('deshideal_users') || '[]');
    return users.find((user: User) => user.email === email) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const users = JSON.parse(localStorage.getItem('deshideal_users') || '[]');
    return users.find((user: User) => user.username === username) || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const users = JSON.parse(localStorage.getItem('deshideal_users') || '[]');
    const index = users.findIndex((user: User) => user.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem('deshideal_users', JSON.stringify(users));
      return users[index];
    }
    return null;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return JSON.parse(localStorage.getItem('deshideal_products') || '[]');
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = JSON.parse(localStorage.getItem('deshideal_products') || '[]');
    return products.find((product: Product) => product.id === id) || null;
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const products = JSON.parse(localStorage.getItem('deshideal_products') || '[]');
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      ...productData,
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem('deshideal_products', JSON.stringify(products));
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = JSON.parse(localStorage.getItem('deshideal_products') || '[]');
    const index = products.findIndex((product: Product) => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      localStorage.setItem('deshideal_products', JSON.stringify(products));
      return products[index];
    }
    return null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const products = JSON.parse(localStorage.getItem('deshideal_products') || '[]');
    const filtered = products.filter((product: Product) => product.id !== id);
    localStorage.setItem('deshideal_products', JSON.stringify(filtered));
    return true;
  }

  // Order operations
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const orders = JSON.parse(localStorage.getItem('deshideal_orders') || '[]');
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      ...orderData,
      status: 'pending',
      trackingStatus: 'Order Placed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem('deshideal_orders', JSON.stringify(orders));
    return newOrder;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const orders = JSON.parse(localStorage.getItem('deshideal_orders') || '[]');
    return orders.filter((order: Order) => order.userId === userId);
  }

  async getAllOrders(): Promise<Order[]> {
    return JSON.parse(localStorage.getItem('deshideal_orders') || '[]');
  }

  async updateOrderStatus(orderId: string, status: Order['status'], trackingNumber?: string, trackingStatus?: string): Promise<Order | null> {
    const orders = JSON.parse(localStorage.getItem('deshideal_orders') || '[]');
    const index = orders.findIndex((order: Order) => order.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      orders[index].updatedAt = new Date().toISOString();
      
      if (trackingNumber) {
        orders[index].trackingNumber = trackingNumber;
      }
      
      if (trackingStatus) {
        orders[index].trackingStatus = trackingStatus;
      } else {
        const statusMap = {
          'pending': 'Order Placed',
          'approved': 'Order Confirmed',
          'processing': 'Preparing for Shipment',
          'shipped': 'In Transit',
          'delivered': 'Delivered',
          'cancelled': 'Cancelled'
        };
        orders[index].trackingStatus = statusMap[status];
      }
      
      localStorage.setItem('deshideal_orders', JSON.stringify(orders));
      return orders[index];
    }
    return null;
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = JSON.parse(localStorage.getItem('deshideal_orders') || '[]');
    return orders.find((order: Order) => order.id === orderId) || null;
  }
}

// Export both the instance and the class
export const db = DatabaseManager.getInstance();
export const Database = DatabaseManager;