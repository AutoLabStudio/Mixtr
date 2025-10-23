# Mixtr - Premium Cocktail Delivery Platform

A full-stack web application for cocktail delivery, mixology classes, and event bookings.

## Features

- 🍸 **Cocktail Delivery**: Browse and order premium cocktails from local bars
- 👨‍🍳 **Mixologist Booking**: Book professional mixologists for events
- 🎓 **Mixology Classes**: Virtual and in-person cocktail making classes
- 🎁 **Loyalty Program**: Earn points and unlock exclusive rewards
- 📦 **Subscription Service**: Regular cocktail deliveries with custom preferences
- 🏢 **Partner Dashboard**: Bar management interface for partners

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TanStack Query for data fetching
- Wouter for routing
- Tailwind CSS for styling
- Shadcn/ui component library

### Backend
- Node.js with Express
- TypeScript
- Passport.js for authentication
- Drizzle ORM
- PostgreSQL (production) / In-memory storage (development)

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AutoLabStudio/Mixtr.git
cd Mixtr
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional for development):
```bash
# Create a .env file
DATABASE_URL=postgresql://user:password@localhost:5432/mixtr
SESSION_SECRET=your-secret-key
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Building for Production

```bash
npm run build
```

### Type Checking

```bash
npm run check
```

## Project Structure

```
mixtr/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context providers
│   │   └── lib/         # Utility functions
├── server/              # Backend Express application
│   ├── auth.ts          # Authentication logic
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Data storage layer
│   └── index.ts         # Server entry point
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema and types
└── .github/
    └── workflows/       # CI/CD pipelines
```

## CI/CD

The project includes GitHub Actions workflows:

- **CI Pipeline**: Runs on every push and PR
  - Type checking
  - Linting
  - Building
  - Security audit

- **Deploy Pipeline**: Runs on push to main branch
  - Build verification
  - Ready for deployment (configure your deployment target)

## Features in Detail

### User Features
- Browse cocktails by bar and category
- Real-time order tracking
- Loyalty points system with tier progression
- Subscription management with preferences
- Event booking with mixologists
- Virtual and in-person mixology classes

### Partner Features
- Bar management dashboard
- Order management
- Cocktail menu management
- Promotion creation
- Analytics and reporting

## Database Schema

The application uses Drizzle ORM with the following main entities:
- Users & Partners
- Bars & Cocktails
- Orders & Subscriptions
- Mixology Classes & Enrollments
- Mixologists & Event Bookings
- Loyalty Program & Rewards
- Promotions

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (optional, falls back to in-memory)
- `SESSION_SECRET`: Secret key for session management
- `NODE_ENV`: Environment mode (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run type checking: `npm run check`
5. Submit a pull request

## License

Proprietary - All rights reserved

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ by AutoLab Studio
