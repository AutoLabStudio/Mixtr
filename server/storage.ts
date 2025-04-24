import { 
  Bar, InsertBar, 
  Cocktail, InsertCocktail, 
  Order, InsertOrder, 
  SpecialOffer, InsertSpecialOffer,
  Subscription, InsertSubscription,
  MixologyClass, InsertMixologyClass,
  ClassEnrollment, InsertClassEnrollment,
  LoyaltyProgram, InsertLoyaltyProgram,
  LoyaltyReward, InsertLoyaltyReward,
  User, InsertUser,
  Partner, InsertPartner,
  Promotion, InsertPromotion,
  Mixologist, InsertMixologist,
  EventBooking, InsertEventBooking
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
  getOrders(): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Special offers
  getSpecialOffers(): Promise<SpecialOffer[]>;
  
  // Subscription operations
  getSubscriptions(): Promise<Subscription[]>;
  getSubscription(id: number): Promise<Subscription | undefined>;
  getSubscriptionsByUser(userId: string): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, data: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  cancelSubscription(id: number): Promise<Subscription | undefined>;
  
  // Mixology Class operations
  getMixologyClasses(): Promise<MixologyClass[]>;
  getMixologyClass(id: number): Promise<MixologyClass | undefined>;
  getMixologyClassesByBar(barId: number): Promise<MixologyClass[]>;
  getUpcomingMixologyClasses(): Promise<MixologyClass[]>;
  
  // Class Enrollment operations
  enrollInClass(enrollment: InsertClassEnrollment): Promise<ClassEnrollment>;
  getClassEnrollment(id: number): Promise<ClassEnrollment | undefined>;
  getClassEnrollmentsByUser(userId: string): Promise<ClassEnrollment[]>;
  
  // Loyalty Program operations
  getLoyaltyProgram(userId: string): Promise<LoyaltyProgram | undefined>;
  createLoyaltyProgram(program: InsertLoyaltyProgram): Promise<LoyaltyProgram>;
  updateLoyaltyPoints(userId: string, points: number): Promise<LoyaltyProgram | undefined>;
  
  // Loyalty Rewards operations
  getLoyaltyRewards(): Promise<LoyaltyReward[]>;
  getLoyaltyReward(id: number): Promise<LoyaltyReward | undefined>;
  getLoyaltyRewardsByTier(tier: string): Promise<LoyaltyReward[]>;
  redeemReward(userId: string, rewardId: number): Promise<boolean>;
  
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  
  // Partner operations
  createPartner(partner: InsertPartner): Promise<Partner>;
  getPartner(id: number): Promise<Partner | undefined>;
  getPartnerByUserId(userId: number): Promise<Partner | undefined>;
  getPartnerByBarId(barId: number): Promise<Partner | undefined>;
  updatePartner(id: number, data: Partial<InsertPartner>): Promise<Partner | undefined>;
  
  // Promotion operations
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  getPromotion(id: number): Promise<Promotion | undefined>;
  getPromotions(): Promise<Promotion[]>;
  getPromotionsByBar(barId: number): Promise<Promotion[]>;
  getActivePromotions(): Promise<Promotion[]>;
  updatePromotion(id: number, data: Partial<InsertPromotion>): Promise<Promotion | undefined>;
  deletePromotion(id: number): Promise<boolean>;
  
  // Mixologist operations
  createMixologist(mixologist: InsertMixologist): Promise<Mixologist>;
  getMixologist(id: number): Promise<Mixologist | undefined>;
  getMixologists(): Promise<Mixologist[]>;
  getMixologistsByBar(barId: number): Promise<Mixologist[]>;
  getFeaturedMixologists(): Promise<Mixologist[]>;
  updateMixologist(id: number, data: Partial<InsertMixologist>): Promise<Mixologist | undefined>;
  
  // Event Booking operations
  createEventBooking(booking: InsertEventBooking): Promise<EventBooking>;
  getEventBooking(id: number): Promise<EventBooking | undefined>;
  getEventBookingsByUser(userId: string): Promise<EventBooking[]>;
  getEventBookingsByMixologist(mixologistId: number): Promise<EventBooking[]>;
  updateEventBookingStatus(id: number, status: string): Promise<EventBooking | undefined>;
}

// Mock data for bars
const mockBars: Bar[] = [
  {
    id: 1,
    name: "The Nightcap Lounge",
    description: "Known for their expertly crafted classics and innovative signature drinks.",
    imageUrl: "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.8,
    deliveryTime: "25-35 min",
    tags: ["Whiskey Specialists", "Craft Cocktails", "Intimate Setting"],
    location: "123 Bourbon Street, New Orleans, LA",
    latitude: 29.9584,
    longitude: -90.0644,
  },
  {
    id: 2,
    name: "Copper & Brew",
    description: "A modern speakeasy combining coffee culture with world-class cocktails.",
    imageUrl: "https://images.pexels.com/photos/1581554/pexels-photo-1581554.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.9,
    deliveryTime: "20-30 min",
    tags: ["Coffee Cocktails", "Award-Winning", "Modern Ambiance"],
    location: "456 Market Street, San Francisco, CA",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    id: 3,
    name: "Aperitivo Social",
    description: "Inspired by the Italian aperitivo tradition, featuring bitter-sweet sophisticated drinks.",
    imageUrl: "https://images.pexels.com/photos/3566226/pexels-photo-3566226.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.7,
    deliveryTime: "30-40 min",
    tags: ["Italian Influenced", "Aperitifs", "Lively Atmosphere"],
    location: "789 Hudson Street, New York, NY",
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    id: 4,
    name: "The Botanist's Garden",
    description: "Focused on garden-to-glass cocktails featuring fresh herbs, fruits, and house-made infusions.",
    imageUrl: "https://images.pexels.com/photos/3201920/pexels-photo-3201920.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.8,
    deliveryTime: "25-35 min",
    tags: ["Garden Fresh", "Seasonal Menu", "Botanical Infusions"],
    location: "321 Palm Avenue, Miami, FL",
    latitude: 25.7617,
    longitude: -80.1918,
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
    imageUrl: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    imageUrl: "https://images.pexels.com/photos/2480828/pexels-photo-2480828.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    imageUrl: "https://images.pexels.com/photos/7412136/pexels-photo-7412136.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    imageUrl: "https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    imageUrl: "https://images.pexels.com/photos/2531187/pexels-photo-2531187.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    imageUrl: "https://images.pexels.com/photos/4784/alcohol-bar-party-cocktail.jpg?auto=compress&cs=tinysrgb&w=600",
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
    imageUrl: "https://images.pexels.com/photos/3019019/pexels-photo-3019019.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    imageUrl: "https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=600",
    discount: 20,
    originalPrice: null,
    discountedPrice: null,
    promoCode: "FIRSTMIX20",
    type: "NEW_CUSTOMER",
  },
];

// Mock data for subscriptions
const mockSubscriptions: Subscription[] = [
  {
    id: 1,
    userId: "user123",
    name: "Classic Cocktail Collection",
    description: "Weekly delivery of 4 classic cocktails, including Old Fashioned, Negroni, Manhattan, and more.",
    imageUrl: "https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 59.99,
    frequency: "weekly",
    preferences: { 
      spirits: ["whiskey", "gin", "vodka"],
      flavors: ["bitter", "sweet", "citrus"]
    },
    active: true,
    nextDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  },
  {
    id: 2,
    userId: "user456",
    name: "Seasonal Favorites",
    description: "Monthly delivery of 6 seasonal cocktails featuring fresh ingredients and innovative recipes.",
    imageUrl: "https://images.pexels.com/photos/3566226/pexels-photo-3566226.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 89.99,
    frequency: "monthly",
    preferences: { 
      spirits: ["rum", "tequila", "mezcal"],
      flavors: ["spicy", "fruity", "herbal"]
    },
    active: true,
    nextDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  }
];

// Mock data for mixology classes
const mockMixologyClasses: MixologyClass[] = [
  {
    id: 1,
    title: "Whiskey Cocktail Masterclass",
    description: "Learn the art of crafting perfect whiskey cocktails from our master mixologist.",
    imageUrl: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=600",
    instructorName: "James Wilson",
    barId: 1,
    price: 45,
    duration: 90,
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    capacity: 20,
    enrolled: 12,
    ingredients: [
      { name: "Premium Bourbon", quantity: "200ml" },
      { name: "Angostura Bitters", quantity: "15ml" },
      { name: "Sugar Cubes", quantity: "10 pieces" },
      { name: "Orange Peel", quantity: "3 pieces" }
    ],
    level: "intermediate",
    videoUrl: "https://example.com/whiskey-masterclass"
  },
  {
    id: 2,
    title: "Italian Aperitivo Hour",
    description: "Discover the Italian tradition of aperitivo with bitter-sweet cocktails perfect for before dinner.",
    imageUrl: "https://images.pexels.com/photos/7412136/pexels-photo-7412136.jpeg?auto=compress&cs=tinysrgb&w=600",
    instructorName: "Sofia Ricci",
    barId: 3,
    price: 35,
    duration: 60,
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    capacity: 15,
    enrolled: 8,
    ingredients: [
      { name: "Campari", quantity: "100ml" },
      { name: "Sweet Vermouth", quantity: "100ml" },
      { name: "Gin", quantity: "100ml" },
      { name: "Prosecco", quantity: "200ml" }
    ],
    level: "beginner",
    videoUrl: "https://example.com/italian-aperitivo"
  }
];

// Mock data for class enrollments
const mockClassEnrollments: ClassEnrollment[] = [
  {
    id: 1,
    userId: "user123",
    classId: 1,
    purchaseDate: new Date(),
    status: "confirmed",
    deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001"
  }
];

// Mock data for loyalty program
const mockLoyaltyPrograms: LoyaltyProgram[] = [
  {
    id: 1,
    userId: "user123",
    points: 250,
    tier: "silver",
    enrollmentDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    lastActivity: new Date()
  },
  {
    id: 2,
    userId: "user456",
    points: 750,
    tier: "gold",
    enrollmentDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    lastActivity: new Date()
  }
];

// Mock data for loyalty rewards
const mockLoyaltyRewards: LoyaltyReward[] = [
  {
    id: 1,
    name: "Free Classic Cocktail",
    description: "Redeem for one free classic cocktail of your choice with any order.",
    imageUrl: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=600",
    pointsCost: 100,
    tier: "bronze",
    type: "free_item",
    active: true
  },
  {
    id: 2,
    name: "Priority Access to Limited Editions",
    description: "Get early access to limited edition seasonal cocktails before they're available to the public.",
    imageUrl: "https://images.pexels.com/photos/3566226/pexels-photo-3566226.jpeg?auto=compress&cs=tinysrgb&w=600",
    pointsCost: 300,
    tier: "silver",
    type: "exclusive_access",
    active: true
  },
  {
    id: 3,
    name: "Free Mixology Class",
    description: "Join any of our virtual mixology classes for free.",
    imageUrl: "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=600",
    pointsCost: 500,
    tier: "gold",
    type: "experience",
    active: true
  }
];

// Mock data for users
const mockUsers: User[] = [
  {
    id: 1,
    username: "customer1",
    password: "$2b$10$X9pQCFUbU9UdMpRE4a8C9uhuOKDc/AUOLrBK15k7Dsq.qVV5OzLl2", // "password123"
    email: "customer1@example.com",
    role: "customer",
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    username: "partner1",
    password: "$2b$10$X9pQCFUbU9UdMpRE4a8C9uhuOKDc/AUOLrBK15k7Dsq.qVV5OzLl2", // "password123"
    email: "partner1@nightcap.com",
    role: "partner",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  },
  {
    id: 3,
    username: "partner2",
    password: "$2b$10$X9pQCFUbU9UdMpRE4a8C9uhuOKDc/AUOLrBK15k7Dsq.qVV5OzLl2", // "password123"
    email: "partner2@copperandbrew.com",
    role: "partner",
    createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000)
  }
];

// Mock data for partners
const mockPartners: Partner[] = [
  {
    id: 1,
    userId: 2,
    barId: 1, // The Nightcap Lounge
    position: "Bar Manager",
    phone: "555-123-4567",
    approved: true
  },
  {
    id: 2,
    userId: 3,
    barId: 2, // Copper & Brew
    position: "Owner",
    phone: "555-987-6543",
    approved: true
  }
];

// Mock data for promotions
const mockPromotions: Promotion[] = [
  {
    id: 1,
    barId: 1,
    title: "Happy Hour Specials",
    description: "Get 20% off all classic cocktails between 5-7pm. Limited time offer!",
    imageUrl: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=600",
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    discountPercentage: 20,
    discountAmount: null,
    promoCode: "HAPPY20",
    usageLimit: 100,
    usageCount: 42,
    active: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    barId: 2,
    title: "Coffee Cocktail Special",
    description: "Try our signature coffee-infused cocktails with $5 off your first order",
    imageUrl: "https://images.pexels.com/photos/2480828/pexels-photo-2480828.jpeg?auto=compress&cs=tinysrgb&w=600",
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    discountPercentage: null,
    discountAmount: 5,
    promoCode: "COFFEE5",
    usageLimit: 50,
    usageCount: 12,
    active: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
];

// Mock data for mixologists
const mockMixologists: Mixologist[] = [
  {
    id: 1,
    name: "Alex Thompson",
    bio: "Award-winning mixologist with over 10 years of experience specializing in whiskey cocktails and molecular mixology. Has worked in top bars in New York, London, and Tokyo.",
    specialties: ["Whiskey", "Molecular Mixology", "Classic Cocktails"],
    imageUrl: "https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=600",
    barId: 1,
    rating: 4.9,
    yearsOfExperience: 10,
    hourlyRate: 150,
    availability: true,
    featured: true
  },
  {
    id: 2,
    name: "Maria Sanchez",
    bio: "Passionate about creating herbal and botanical infusions. Maria brings a garden-to-glass approach to her craft with a focus on sustainability and seasonal ingredients.",
    specialties: ["Botanical Cocktails", "Sustainable Mixology", "Herbal Infusions"],
    imageUrl: "https://images.pexels.com/photos/3065025/pexels-photo-3065025.jpeg?auto=compress&cs=tinysrgb&w=600",
    barId: 4,
    rating: 4.8,
    yearsOfExperience: 7,
    hourlyRate: 125,
    availability: true,
    featured: true
  },
  {
    id: 3,
    name: "Daniel Kim",
    bio: "Specializing in Asian-inspired cocktails and coffee-based drinks. Daniel's creative combinations and presentation style have earned him a dedicated following.",
    specialties: ["Coffee Cocktails", "Asian-Inspired Drinks", "Theatrical Presentation"],
    imageUrl: "https://images.pexels.com/photos/4252139/pexels-photo-4252139.jpeg?auto=compress&cs=tinysrgb&w=600",
    barId: 2,
    rating: 4.7,
    yearsOfExperience: 5,
    hourlyRate: 110,
    availability: true,
    featured: false
  },
  {
    id: 4,
    name: "Isabella Romano",
    bio: "An expert in Italian aperitivo culture and techniques. Isabella brings authentic Italian traditions and flavors to every event with a focus on bitter-sweet balance.",
    specialties: ["Italian Aperitivo", "Bitter-Sweet Cocktails", "Spritzers"],
    imageUrl: "https://images.pexels.com/photos/4874259/pexels-photo-4874259.jpeg?auto=compress&cs=tinysrgb&w=600",
    barId: 3,
    rating: 4.9,
    yearsOfExperience: 9,
    hourlyRate: 140,
    availability: true,
    featured: true
  }
];

// Mock data for event bookings
const mockEventBookings: EventBooking[] = [
  {
    id: 1,
    userId: "user123",
    mixologistId: 1,
    eventType: "Corporate",
    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    eventDuration: 4,
    guestCount: 50,
    location: "123 Corporate Plaza, San Francisco, CA",
    specialRequests: "Focus on whiskey tasting and education. Need equipment for presentation.",
    status: "approved",
    totalPrice: 750,
    createdAt: new Date()
  },
  {
    id: 2,
    userId: "user456",
    mixologistId: 2,
    eventType: "Wedding",
    eventDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    eventDuration: 6,
    guestCount: 120,
    location: "Sunset Gardens, 456 Beach Road, Malibu, CA",
    specialRequests: "Need signature cocktails for bride and groom. One should be floral and the other citrus-based.",
    status: "pending",
    totalPrice: 950,
    createdAt: new Date()
  },
  {
    id: 3,
    userId: "user789",
    mixologistId: 4,
    eventType: "Birthday",
    eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    eventDuration: 3,
    guestCount: 25,
    location: "789 Lakeview Terrace, Chicago, IL",
    specialRequests: "Italian-themed cocktail experience with spritz varieties.",
    status: "approved",
    totalPrice: 525,
    createdAt: new Date()
  }
];

export class MemStorage implements IStorage {
  private bars: Map<number, Bar>;
  private cocktails: Map<number, Cocktail>;
  private orders: Map<number, Order>;
  private specialOffers: Map<number, SpecialOffer>;
  private subscriptions: Map<number, Subscription>;
  private mixologists: Map<number, Mixologist>;
  private eventBookings: Map<number, EventBooking>;
  private mixologyClasses: Map<number, MixologyClass>;
  private classEnrollments: Map<number, ClassEnrollment>;
  private loyaltyPrograms: Map<string, LoyaltyProgram>;
  private loyaltyRewards: Map<number, LoyaltyReward>;
  private users: Map<number, User>;
  private partners: Map<number, Partner>;
  private promotions: Map<number, Promotion>;
  
  private orderId: number;
  private subscriptionId: number;
  private classId: number;
  private enrollmentId: number;
  private loyaltyRewardId: number;
  private userId: number;
  private partnerId: number;
  private promotionId: number;
  
  constructor() {
    this.bars = new Map();
    this.cocktails = new Map();
    this.orders = new Map();
    this.specialOffers = new Map();
    this.subscriptions = new Map();
    this.mixologyClasses = new Map();
    this.classEnrollments = new Map();
    this.loyaltyPrograms = new Map();
    this.loyaltyRewards = new Map();
    this.users = new Map();
    this.partners = new Map();
    this.promotions = new Map();
    this.mixologists = new Map();
    this.eventBookings = new Map();
    
    this.orderId = 1;
    this.subscriptionId = 3;  // Starting after mock data
    this.classId = 3;        // Starting after mock data
    this.enrollmentId = 2;   // Starting after mock data
    this.loyaltyRewardId = 4;  // Starting after mock data
    this.userId = 4;         // Starting after mock data
    this.partnerId = 3;      // Starting after mock data
    this.promotionId = 3;    // Starting after mock data
    
    // Initialize with mock data
    mockBars.forEach(bar => this.bars.set(bar.id, bar));
    mockCocktails.forEach(cocktail => this.cocktails.set(cocktail.id, cocktail));
    mockSpecialOffers.forEach(offer => this.specialOffers.set(offer.id, offer));
    mockSubscriptions.forEach(sub => this.subscriptions.set(sub.id, sub));
    mockMixologyClasses.forEach(cls => this.mixologyClasses.set(cls.id, cls));
    mockClassEnrollments.forEach(enr => this.classEnrollments.set(enr.id, enr));
    mockLoyaltyPrograms.forEach(lp => this.loyaltyPrograms.set(lp.userId, lp));
    mockLoyaltyRewards.forEach(reward => this.loyaltyRewards.set(reward.id, reward));
    mockUsers.forEach(user => this.users.set(user.id, user));
    mockPartners.forEach(partner => this.partners.set(partner.id, partner));
    mockPromotions.forEach(promotion => this.promotions.set(promotion.id, promotion));
    mockMixologists.forEach(mixologist => this.mixologists.set(mixologist.id, mixologist));
    mockEventBookings.forEach(booking => this.eventBookings.set(booking.id, booking));
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
  
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
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
  
  // Subscription operations
  async getSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values());
  }
  
  async getSubscription(id: number): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }
  
  async getSubscriptionsByUser(userId: string): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      subscription => subscription.userId === userId
    );
  }
  
  async createSubscription(subscriptionData: InsertSubscription): Promise<Subscription> {
    const id = this.subscriptionId++;
    const createdAt = new Date();
    const active = subscriptionData.active !== undefined ? subscriptionData.active : true;
    const subscription: Subscription = { 
      ...subscriptionData, 
      id, 
      createdAt, 
      active,
      preferences: subscriptionData.preferences || {}
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }
  
  async updateSubscription(id: number, data: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (subscription) {
      const updatedSubscription = { ...subscription, ...data };
      this.subscriptions.set(id, updatedSubscription);
      return updatedSubscription;
    }
    return undefined;
  }
  
  async cancelSubscription(id: number): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (subscription) {
      const updatedSubscription = { ...subscription, active: false };
      this.subscriptions.set(id, updatedSubscription);
      return updatedSubscription;
    }
    return undefined;
  }
  
  // Mixology Class operations
  async getMixologyClasses(): Promise<MixologyClass[]> {
    return Array.from(this.mixologyClasses.values());
  }
  
  async getMixologyClass(id: number): Promise<MixologyClass | undefined> {
    return this.mixologyClasses.get(id);
  }
  
  async getMixologyClassesByBar(barId: number): Promise<MixologyClass[]> {
    return Array.from(this.mixologyClasses.values()).filter(
      cls => cls.barId === barId
    );
  }
  
  async getUpcomingMixologyClasses(): Promise<MixologyClass[]> {
    const now = new Date();
    return Array.from(this.mixologyClasses.values()).filter(
      cls => cls.date > now
    );
  }
  
  // Class Enrollment operations
  async enrollInClass(enrollmentData: InsertClassEnrollment): Promise<ClassEnrollment> {
    const id = this.enrollmentId++;
    const purchaseDate = new Date();
    const enrollment: ClassEnrollment = { ...enrollmentData, id, purchaseDate };
    this.classEnrollments.set(id, enrollment);
    
    // Update the class enrollment count
    const mixologyClass = this.mixologyClasses.get(enrollmentData.classId);
    if (mixologyClass) {
      const currentEnrolled = mixologyClass.enrolled || 0;
      const updatedClass = { ...mixologyClass, enrolled: currentEnrolled + 1 };
      this.mixologyClasses.set(mixologyClass.id, updatedClass);
    }
    
    return enrollment;
  }
  
  async getClassEnrollment(id: number): Promise<ClassEnrollment | undefined> {
    return this.classEnrollments.get(id);
  }
  
  async getClassEnrollmentsByUser(userId: string): Promise<ClassEnrollment[]> {
    return Array.from(this.classEnrollments.values()).filter(
      enrollment => enrollment.userId === userId
    );
  }
  
  // Loyalty Program operations
  async getLoyaltyProgram(userId: string): Promise<LoyaltyProgram | undefined> {
    return this.loyaltyPrograms.get(userId);
  }
  
  async createLoyaltyProgram(programData: InsertLoyaltyProgram): Promise<LoyaltyProgram> {
    const enrollmentDate = new Date();
    const lastActivity = new Date();
    const points = 0;
    const program: LoyaltyProgram = { 
      ...programData, 
      id: this.loyaltyPrograms.size + 1, 
      points, 
      enrollmentDate, 
      lastActivity 
    };
    this.loyaltyPrograms.set(programData.userId, program);
    return program;
  }
  
  async updateLoyaltyPoints(userId: string, points: number): Promise<LoyaltyProgram | undefined> {
    const program = this.loyaltyPrograms.get(userId);
    if (program) {
      let tier = program.tier;
      const currentPoints = program.points || 0;
      const newPoints = currentPoints + points;
      
      // Update tier based on new points
      if (newPoints >= 750) {
        tier = "gold";
      } else if (newPoints >= 300) {
        tier = "silver";
      } else if (newPoints >= 100) {
        tier = "bronze";
      }
      
      const updatedProgram = { 
        ...program, 
        points: newPoints, 
        tier, 
        lastActivity: new Date() 
      };
      this.loyaltyPrograms.set(userId, updatedProgram);
      return updatedProgram;
    }
    return undefined;
  }
  
  // Loyalty Rewards operations
  async getLoyaltyRewards(): Promise<LoyaltyReward[]> {
    return Array.from(this.loyaltyRewards.values()).filter(reward => reward.active);
  }
  
  async getLoyaltyReward(id: number): Promise<LoyaltyReward | undefined> {
    return this.loyaltyRewards.get(id);
  }
  
  async getLoyaltyRewardsByTier(tier: string): Promise<LoyaltyReward[]> {
    // Get rewards for the specified tier and all lower tiers
    const tierLevels = { "bronze": 1, "silver": 2, "gold": 3, "platinum": 4 };
    const requestedTierLevel = tierLevels[tier as keyof typeof tierLevels] || 0;
    
    return Array.from(this.loyaltyRewards.values()).filter(reward => {
      const rewardTierLevel = tierLevels[reward.tier as keyof typeof tierLevels] || 0;
      return reward.active && rewardTierLevel <= requestedTierLevel;
    });
  }
  
  async redeemReward(userId: string, rewardId: number): Promise<boolean> {
    const program = this.loyaltyPrograms.get(userId);
    const reward = this.loyaltyRewards.get(rewardId);
    
    if (!program || !reward || !reward.active) {
      return false;
    }
    
    const currentPoints = program.points || 0;
    
    // Check if user has enough points
    if (currentPoints < reward.pointsCost) {
      return false;
    }
    
    // Check if user has high enough tier
    const tierLevels = { "bronze": 1, "silver": 2, "gold": 3, "platinum": 4 };
    const userTierLevel = tierLevels[program.tier as keyof typeof tierLevels] || 0;
    const rewardTierLevel = tierLevels[reward.tier as keyof typeof tierLevels] || 0;
    
    if (userTierLevel < rewardTierLevel) {
      return false;
    }
    
    // Deduct points and update last activity
    const updatedProgram = { 
      ...program, 
      points: currentPoints - reward.pointsCost, 
      lastActivity: new Date() 
    };
    this.loyaltyPrograms.set(userId, updatedProgram);
    
    return true;
  }
  
  // User operations
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    // Ensure role is always defined
    const user: User = { 
      ...userData, 
      id, 
      createdAt,
      role: userData.role || 'customer' 
    };
    this.users.set(id, user);
    return user;
  }
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...data };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }
  
  // Partner operations
  async createPartner(partnerData: InsertPartner): Promise<Partner> {
    const id = this.partnerId++;
    // Ensure approved field is defined
    const partner: Partner = { 
      ...partnerData, 
      id,
      approved: partnerData.approved !== undefined ? partnerData.approved : false
    };
    this.partners.set(id, partner);
    return partner;
  }
  
  async getPartner(id: number): Promise<Partner | undefined> {
    return this.partners.get(id);
  }
  
  async getPartnerByUserId(userId: number): Promise<Partner | undefined> {
    return Array.from(this.partners.values()).find(partner => partner.userId === userId);
  }
  
  async getPartnerByBarId(barId: number): Promise<Partner | undefined> {
    return Array.from(this.partners.values()).find(partner => partner.barId === barId);
  }
  
  async updatePartner(id: number, data: Partial<InsertPartner>): Promise<Partner | undefined> {
    const partner = this.partners.get(id);
    if (partner) {
      const updatedPartner = { ...partner, ...data };
      this.partners.set(id, updatedPartner);
      return updatedPartner;
    }
    return undefined;
  }
  
  // Promotion operations
  async createPromotion(promotionData: InsertPromotion): Promise<Promotion> {
    const id = this.promotionId++;
    const createdAt = new Date();
    const usageCount = 0;
    // Ensure all required fields are defined
    const promotion: Promotion = { 
      ...promotionData, 
      id, 
      createdAt, 
      usageCount,
      active: promotionData.active !== undefined ? promotionData.active : true,
      discountPercentage: promotionData.discountPercentage || null,
      discountAmount: promotionData.discountAmount || null,
      usageLimit: promotionData.usageLimit || null
    };
    this.promotions.set(id, promotion);
    return promotion;
  }
  
  async getPromotion(id: number): Promise<Promotion | undefined> {
    return this.promotions.get(id);
  }
  
  async getPromotions(): Promise<Promotion[]> {
    return Array.from(this.promotions.values());
  }
  
  async getPromotionsByBar(barId: number): Promise<Promotion[]> {
    return Array.from(this.promotions.values()).filter(
      promotion => promotion.barId === barId
    );
  }
  
  async getActivePromotions(): Promise<Promotion[]> {
    const now = new Date();
    return Array.from(this.promotions.values()).filter(
      promotion => promotion.active && promotion.startDate <= now && promotion.endDate >= now
    );
  }
  
  async updatePromotion(id: number, data: Partial<InsertPromotion>): Promise<Promotion | undefined> {
    const promotion = this.promotions.get(id);
    if (promotion) {
      const updatedPromotion = { ...promotion, ...data };
      this.promotions.set(id, updatedPromotion);
      return updatedPromotion;
    }
    return undefined;
  }
  
  async deletePromotion(id: number): Promise<boolean> {
    const exists = this.promotions.has(id);
    if (exists) {
      this.promotions.delete(id);
      return true;
    }
    return false;
  }
}

export const storage = new MemStorage();
