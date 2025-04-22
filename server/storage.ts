import { 
  Bar, InsertBar, 
  Cocktail, InsertCocktail, 
  Order, InsertOrder, 
  SpecialOffer, InsertSpecialOffer 
} from "@shared/schema";

export interface IStorage {
  // Bar operations
  getBars(): Promise<Bar[]>;
  getBar(id: number): Promise<Bar | undefined>;
  
  // Cocktail operations
  getCocktails(): Promise<Cocktail[]>;
  getCocktail(id: number): Promise<Cocktail | undefined>;
  getCocktailsByBar(barId: number): Promise<Cocktail[]>;
  getFeaturedCocktails(): Promise<Cocktail[]>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Special offers
  getSpecialOffers(): Promise<SpecialOffer[]>;
}

// Mock data for bars
const mockBars: Bar[] = [
  {
    id: 1,
    name: "The Nightcap Lounge",
    description: "Known for their expertly crafted classics and innovative signature drinks.",
    imageUrl: "https://placehold.co/600x400/333/fff?text=The+Nightcap+Lounge",
    rating: 4.8,
    deliveryTime: "25-35 min",
    tags: ["Whiskey Specialists", "Craft Cocktails", "Intimate Setting"],
  },
  {
    id: 2,
    name: "Copper & Brew",
    description: "A modern speakeasy combining coffee culture with world-class cocktails.",
    imageUrl: "https://placehold.co/600x400/853/fff?text=Copper+%26+Brew",
    rating: 4.9,
    deliveryTime: "20-30 min",
    tags: ["Coffee Cocktails", "Award-Winning", "Modern Ambiance"],
  },
  {
    id: 3,
    name: "Aperitivo Social",
    description: "Inspired by the Italian aperitivo tradition, featuring bitter-sweet sophisticated drinks.",
    imageUrl: "https://placehold.co/600x400/a52/fff?text=Aperitivo+Social",
    rating: 4.7,
    deliveryTime: "30-40 min",
    tags: ["Italian Influenced", "Aperitifs", "Lively Atmosphere"],
  },
  {
    id: 4,
    name: "The Botanist's Garden",
    description: "Focused on garden-to-glass cocktails featuring fresh herbs, fruits, and house-made infusions.",
    imageUrl: "https://placehold.co/600x400/373/fff?text=Botanist%27s+Garden",
    rating: 4.8,
    deliveryTime: "25-35 min",
    tags: ["Garden Fresh", "Seasonal Menu", "Botanical Infusions"],
  },
];

// Mock data for cocktails
const mockCocktails: Cocktail[] = [
  {
    id: 1,
    name: "Old Fashioned",
    description: "Bourbon, sugar, Angostura bitters, and an orange twist. A timeless classic with our house-aged whiskey.",
    price: 14,
    ingredients: ["Bourbon", "Sugar", "Angostura bitters", "Orange twist"],
    imageUrl: "https://placehold.co/600x400/a63/fff?text=Old+Fashioned",
    barId: 1,
    featured: true,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Espresso Martini",
    description: "Vodka, coffee liqueur, fresh espresso, and a hint of vanilla. The perfect pick-me-up cocktail.",
    price: 16,
    ingredients: ["Vodka", "Coffee liqueur", "Fresh espresso", "Vanilla"],
    imageUrl: "https://placehold.co/600x400/553/fff?text=Espresso+Martini",
    barId: 2,
    featured: true,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Negroni",
    description: "Equal parts gin, Campari, and sweet vermouth. A perfectly balanced bitter-sweet aperitif.",
    price: 15,
    ingredients: ["Gin", "Campari", "Sweet vermouth", "Orange peel"],
    imageUrl: "https://placehold.co/600x400/c33/fff?text=Negroni",
    barId: 3,
    featured: true,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Botanist's Gin & Tonic",
    description: "Premium gin infused with fresh herbs, house-made tonic, and seasonal botanicals.",
    price: 13,
    ingredients: ["Infused gin", "House-made tonic", "Seasonal botanicals", "Lime"],
    imageUrl: "https://placehold.co/600x400/393/fff?text=Gin+%26+Tonic",
    barId: 4,
    featured: true,
    rating: 4.8,
  },
  {
    id: 5,
    name: "Manhattan",
    description: "Rye whiskey, sweet vermouth, and bitters. Garnished with a brandied cherry.",
    price: 15,
    ingredients: ["Rye whiskey", "Sweet vermouth", "Bitters", "Brandied cherry"],
    imageUrl: "https://placehold.co/600x400/933/fff?text=Manhattan",
    barId: 1,
    featured: false,
    rating: 4.7,
  },
  {
    id: 6,
    name: "Mojito",
    description: "White rum, fresh lime juice, mint leaves, sugar, and soda water. Refreshing and bright.",
    price: 13,
    ingredients: ["White rum", "Fresh lime juice", "Mint leaves", "Sugar", "Soda water"],
    imageUrl: "https://placehold.co/600x400/5a5/fff?text=Mojito",
    barId: 3,
    featured: false,
    rating: 4.6,
  },
];

// Mock data for special offers
const mockSpecialOffers: SpecialOffer[] = [
  {
    id: 1,
    title: "Weekend Cocktail Box",
    description: "Get a curated box of 4 premium cocktails for your weekend enjoyment. Perfect for sharing with friends.",
    imageUrl: "https://placehold.co/600x400/b84/fff?text=Weekend+Box",
    discount: 23,
    originalPrice: 64,
    discountedPrice: 49,
    promoCode: null,
    type: "LIMITED_TIME",
  },
  {
    id: 2,
    title: "First Order Discount",
    description: "New to Mixtr? Enjoy 20% off your first order with us. Experience premium cocktail delivery.",
    imageUrl: "https://placehold.co/600x400/48b/fff?text=20%25+Off",
    discount: 20,
    originalPrice: null,
    discountedPrice: null,
    promoCode: "FIRSTMIX20",
    type: "NEW_CUSTOMER",
  },
];

export class MemStorage implements IStorage {
  private bars: Map<number, Bar>;
  private cocktails: Map<number, Cocktail>;
  private orders: Map<number, Order>;
  private specialOffers: Map<number, SpecialOffer>;
  private orderId: number;
  
  constructor() {
    this.bars = new Map();
    this.cocktails = new Map();
    this.orders = new Map();
    this.specialOffers = new Map();
    this.orderId = 1;
    
    // Initialize with mock data
    mockBars.forEach(bar => this.bars.set(bar.id, bar));
    mockCocktails.forEach(cocktail => this.cocktails.set(cocktail.id, cocktail));
    mockSpecialOffers.forEach(offer => this.specialOffers.set(offer.id, offer));
  }
  
  // Bar operations
  async getBars(): Promise<Bar[]> {
    return Array.from(this.bars.values());
  }
  
  async getBar(id: number): Promise<Bar | undefined> {
    return this.bars.get(id);
  }
  
  // Cocktail operations
  async getCocktails(): Promise<Cocktail[]> {
    return Array.from(this.cocktails.values());
  }
  
  async getCocktail(id: number): Promise<Cocktail | undefined> {
    return this.cocktails.get(id);
  }
  
  async getCocktailsByBar(barId: number): Promise<Cocktail[]> {
    return Array.from(this.cocktails.values()).filter(
      cocktail => cocktail.barId === barId
    );
  }
  
  async getFeaturedCocktails(): Promise<Cocktail[]> {
    return Array.from(this.cocktails.values()).filter(
      cocktail => cocktail.featured
    );
  }
  
  // Order operations
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const createdAt = new Date();
    const order: Order = { ...orderData, id, createdAt };
    this.orders.set(id, order);
    return order;
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getOrdersByUser(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => order.userId === userId
    );
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, status };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }
  
  // Special offers
  async getSpecialOffers(): Promise<SpecialOffer[]> {
    return Array.from(this.specialOffers.values());
  }
}

export const storage = new MemStorage();
