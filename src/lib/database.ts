import { Product, User, Order, OrderItem, Rider, GeoPoint } from '../types';

type CreateOrderInput = {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    product: Product;
  }>;
  total: number;
  shippingAddress: string;
};

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

      const riderUser: User = {
        id: 'rider-1',
        email: 'rider@deshideal.com',
        password: 'rider123',
        name: 'Delivery Rider',
        username: 'rider',
        mobile: '+880-5555-000000',
        address: 'Dhaka, Bangladesh',
        role: 'rider',
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('deshideal_users', JSON.stringify([adminUser, demoUser, riderUser]));

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
    // Ensure rider user exists even if DB was initialized before rider role was added
    const existingUsers: User[] = JSON.parse(localStorage.getItem('deshideal_users') || '[]');
    const hasRider = existingUsers.some(u => u.email === 'rider@deshideal.com');
    if (!hasRider) {
      const riderUser: User = {
        id: 'rider-1',
        email: 'rider@deshideal.com',
        password: 'rider123',
        name: 'Delivery Rider',
        username: 'rider',
        mobile: '+880-5555-000000',
        address: 'Dhaka, Bangladesh',
        role: 'rider',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('deshideal_users', JSON.stringify([...existingUsers, riderUser]));
    }
  }
  // User list helpers
  async getUsersByRole(role: User['role']): Promise<User[]> {
    const users = JSON.parse(localStorage.getItem('deshideal_users') || '[]');
    return users.filter((u: User) => u.role === role);
  }


  // Simple pub/sub for order realtime updates
  private orderSubscribers: Map<string, Set<(order: Order) => void>> = new Map();
  private movementTimers: Map<string, number> = new Map();

  private notifyOrder(orderId: string, order: Order) {
    const subs = this.orderSubscribers.get(orderId);
    subs?.forEach((cb) => cb(order));
  }

  subscribeToOrder(orderId: string, callback: (order: Order) => void): () => void {
    if (!this.orderSubscribers.has(orderId)) {
      this.orderSubscribers.set(orderId, new Set());
    }
    this.orderSubscribers.get(orderId)!.add(callback);
    // Immediately emit current
    this.getOrderById(orderId).then((ord) => ord && callback(ord));
    return () => {
      this.orderSubscribers.get(orderId)?.delete(callback);
    };
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

  async createOrder(orderData: CreateOrderInput): Promise<Order> {
    const orders = JSON.parse(localStorage.getItem('deshideal_orders') || '[]');
    const orderId = `order-${Date.now()}`;
    const items: OrderItem[] = orderData.items.map((it, idx) => ({
      id: `${orderId}-item-${idx + 1}`,
      orderId,
      productId: it.productId,
      quantity: it.quantity,
      price: it.price,
      product: it.product
    }));
    const newOrder: Order = {
      id: orderId,
      userId: orderData.userId,
      items,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress,
      status: 'pending',
      trackingStatus: 'Order Placed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      storeLocation: this.getDefaultStoreLocation(),
      destinationLocation: this.deriveDestinationFromAddress(orderData.shippingAddress),
      currentLocation: undefined,
      promisedDeliveryAt: undefined,
      rider: undefined,
      trackingNumber: undefined
    } as Order;
    orders.push(newOrder);
    localStorage.setItem('deshideal_orders', JSON.stringify(orders));
    this.notifyOrder(newOrder.id, newOrder);
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
          'out_for_delivery': 'Rider is on the way',
          'shipped': 'In Transit',
          'delivered': 'Delivered',
          'cancelled': 'Cancelled'
        };
        orders[index].trackingStatus = (statusMap as any)[status];
      }
      
      localStorage.setItem('deshideal_orders', JSON.stringify(orders));
      const updated: Order = orders[index];
      // Stop simulator once delivered/cancelled
      if (status === 'delivered' || status === 'cancelled') {
        const timerId = this.movementTimers.get(orderId);
        if (timerId) {
          clearInterval(timerId);
          this.movementTimers.delete(orderId);
        }
      }
      this.notifyOrder(orderId, updated);
      return updated;
    }
    return null;
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = JSON.parse(localStorage.getItem('deshideal_orders') || '[]');
    return orders.find((order: Order) => order.id === orderId) || null;
  }

  async startExpressDelivery(orderId: string, rider: Rider, promisedMinutes = 10): Promise<Order | null> {
    const orders = JSON.parse(localStorage.getItem('deshideal_orders') || '[]');
    const index = orders.findIndex((order: Order) => order.id === orderId);
    if (index === -1) return null;

    const now = Date.now();
    const promisedAt = new Date(now + promisedMinutes * 60_000).toISOString();
    const order: Order = orders[index];
    const store = order.storeLocation ?? this.getDefaultStoreLocation();
    const destination = order.destinationLocation ?? this.deriveDestinationFromAddress(order.shippingAddress);
    const currentLocation = { ...store, updatedAt: new Date().toISOString() } as Order['currentLocation'];

    const updated: Order = {
      ...order,
      status: 'out_for_delivery',
      trackingStatus: 'Rider picked up your order',
      promisedDeliveryAt: promisedAt,
      rider,
      storeLocation: store,
      destinationLocation: destination,
      currentLocation,
      updatedAt: new Date().toISOString()
    };
    orders[index] = updated;
    localStorage.setItem('deshideal_orders', JSON.stringify(orders));
    this.notifyOrder(orderId, updated);

    // Start movement simulator
    this.startMovementSimulation(updated);
    return updated;
  }

  async assignRider(orderId: string, rider: Rider): Promise<Order | null> {
    const orders = JSON.parse(localStorage.getItem('deshideal_orders') || '[]');
    const index = orders.findIndex((order: Order) => order.id === orderId);
    if (index === -1) return null;
    orders[index].rider = rider;
    localStorage.setItem('deshideal_orders', JSON.stringify(orders));
    const updated: Order = orders[index];
    this.notifyOrder(orderId, updated);
    return updated;
  }

  async updateOrderLocation(orderId: string, lat: number, lng: number): Promise<Order | null> {
    const orders = JSON.parse(localStorage.getItem('deshideal_orders') || '[]');
    const index = orders.findIndex((order: Order) => order.id === orderId);
    if (index === -1) return null;
    // If simulation is running, stop it to prioritize real GPS
    const timerId = this.movementTimers.get(orderId);
    if (timerId) {
      clearInterval(timerId);
      this.movementTimers.delete(orderId);
    }
    orders[index].currentLocation = { lat, lng, updatedAt: new Date().toISOString() };
    orders[index].updatedAt = new Date().toISOString();
    localStorage.setItem('deshideal_orders', JSON.stringify(orders));
    const updated: Order = orders[index];
    this.notifyOrder(orderId, updated);
    return updated;
  }

  private startMovementSimulation(order: Order) {
    // Clear existing timer
    const existing = this.movementTimers.get(order.id);
    if (existing) {
      clearInterval(existing);
    }

    if (!order.destinationLocation || !order.storeLocation || !order.promisedDeliveryAt) return;
    const dest = order.destinationLocation;
    const start = order.currentLocation ?? { ...order.storeLocation, updatedAt: new Date().toISOString() };
    const startTime = Date.now();
    const endTime = new Date(order.promisedDeliveryAt).getTime();
    const totalMs = Math.max(endTime - startTime, 1);

    const interval = window.setInterval(async () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / totalMs, 1);
      const lat = start.lat + (dest.lat - start.lat) * progress;
      const lng = start.lng + (dest.lng - start.lng) * progress;

      const stored = await this.getOrderById(order.id);
      if (!stored) {
        clearInterval(interval);
        this.movementTimers.delete(order.id);
        return;
      }

      // Stop early if delivered/cancelled elsewhere
      if (stored.status === 'delivered' || stored.status === 'cancelled') {
        clearInterval(interval);
        this.movementTimers.delete(order.id);
        return;
      }

      if (progress >= 1) {
        await this.updateOrderStatus(order.id, 'delivered', stored.trackingNumber, 'Delivered within 10 minutes');
        clearInterval(interval);
        this.movementTimers.delete(order.id);
        return;
      }

      const orders = JSON.parse(localStorage.getItem('deshideal_orders') || '[]');
      const idx = orders.findIndex((o: Order) => o.id === order.id);
      if (idx !== -1) {
        orders[idx].currentLocation = { lat, lng, updatedAt: new Date().toISOString() };
        orders[idx].updatedAt = new Date().toISOString();
        localStorage.setItem('deshideal_orders', JSON.stringify(orders));
        this.notifyOrder(order.id, orders[idx]);
      }
    }, 3000);

    this.movementTimers.set(order.id, interval);
  }

  private getDefaultStoreLocation(): GeoPoint {
    // Dhaka central store fallback
    return { lat: 23.7808875, lng: 90.2792371 };
  }

  private deriveDestinationFromAddress(_address: string): GeoPoint {
    // Simple stub: randomize within ~3km of store to simulate different destinations
    const base = this.getDefaultStoreLocation();
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    const deltaLat = rand(-0.02, 0.02); // ~2km
    const deltaLng = rand(-0.02, 0.02);
    return { lat: base.lat + deltaLat, lng: base.lng + deltaLng };
  }
}

// Export both the instance and the class
export const db = DatabaseManager.getInstance();
export const Database = DatabaseManager;