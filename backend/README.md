# Intuition Exchange - Backend API

Backend API for Intuition Exchange cryptocurrency trading platform.

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT + Passport
- **Payments**: Stripe
- **Trading**: Binance API
- **Notifications**: Twilio (SMS) + SendGrid (Email)

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- npm or yarn

## Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
Copy `.env` and update with your credentials:
- Database URL
- Binance API keys
- Stripe keys
- Twilio credentials
- SendGrid API key

3. **Set up database**:
```bash
# Create database
createdb intuition_exchange

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

4. **Start development server**:
```bash
npm run start:dev
```

Server will run on `http://localhost:8000`

## Project Structure

```
src/
├── modules/
│   ├── auth/              # Authentication & JWT
│   ├── users/             # User management
│   ├── kyc/               # KYC/Onboarding
│   ├── fiat/              # Fiat operations
│   ├── crypto/            # Crypto wallets & transactions
│   ├── trading/           # Spot trading (Binance)
│   ├── p2p/               # P2P marketplace
│   ├── admin/             # Admin dashboard
│   ├── notifications/     # Email/SMS service
│   └── market-data/       # Price feeds, WebSocket
├── common/
│   ├── guards/            # Auth guards
│   ├── interceptors/      # Logging, transformation
│   ├── decorators/        # Custom decorators
│   └── filters/           # Exception filters
├── prisma.service.ts      # Database service
├── app.module.ts          # Root module
└── main.ts                # Application entry
```

## Available Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## API Documentation

Once the server is running, API will be available at:
- Base URL: `http://localhost:8000/api`

### Main Endpoints

- `/api/account/*` - Authentication & user management
- `/api/onboarding/*` - KYC process
- `/api/fiat/*` - Fiat deposits/withdrawals
- `/api/assets/*` - Crypto wallets & transactions
- `/trade` - Spot trading
- `/p2p-order` - P2P marketplace
- `/admin/*` - Admin dashboard

## Database Schema

The database includes the following main tables:
- `users` - User accounts
- `kyc` - KYC information
- `fiat_balances` - USD balances
- `crypto_balances` - Crypto asset balances
- `trades` - Spot trading history
- `p2p_orders` - P2P marketplace orders
- `deposit_addresses` - Crypto deposit addresses
- `withdrawal_addresses` - Whitelisted withdrawal addresses

View full schema in `prisma/schema.prisma`

## Development Status

✅ Phase 1: Project Setup (Complete)
- NestJS project initialized
- Database schema defined
- Environment configured
- Dependencies installed

🔄 Phase 2: Authentication (In Progress)
- JWT authentication
- Email/Phone OTP
- Password management

⏳ Phase 3-10: Coming Soon
- KYC system
- Fiat operations
- Crypto wallets
- Trading engine
- P2P marketplace
- Admin dashboard

## Security Notes

⚠️ **Important**: This is a development setup. Before production:
1. Change all default passwords and secrets
2. Enable SSL/TLS
3. Set up proper firewall rules
4. Implement rate limiting
5. Add monitoring and logging
6. Conduct security audit
7. Set up backup systems

## License

Proprietary - Intuition Exchange
