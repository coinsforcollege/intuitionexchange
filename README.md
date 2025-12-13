# Intuition Exchange

A cryptocurrency exchange platform with fiat on/off ramps, spot trading, and P2P marketplace.

## Project Structure

```
IntuitionExchange/
├── frontend/          # Next.js frontend application
│   ├── components/    # React components
│   ├── pages/         # Next.js pages
│   ├── public/        # Static assets
│   ├── styles/        # CSS styles
│   ├── context/       # React context providers
│   ├── types/         # TypeScript types
│   └── util/          # Utility functions
│
├── backend/           # NestJS backend API
│   ├── src/           # Source code
│   ├── prisma/        # Database schema
│   └── test/          # Tests
│
└── docs/              # Documentation
```

## Getting Started

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### Backend (NestJS)

```bash
cd backend

# Set up database
createdb intuition_exchange
npx prisma migrate dev

# Start server
npm install
npm run start:dev
```

Backend API runs on `http://localhost:8000`

## Tech Stack

### Frontend
- **Framework**: Next.js 13
- **Language**: TypeScript
- **UI**: Ant Design
- **State**: Zustand
- **HTTP**: Axios

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL + Prisma
- **Cache**: Redis
- **Auth**: JWT + Passport
- **Payments**: Stripe
- **Trading**: Binance API
- **Notifications**: Twilio + SendGrid

## Features

- ✅ User authentication (email/phone OTP)
- ✅ KYC/Onboarding (5-step process)
- ✅ Fiat deposits (Stripe cards, wire transfers)
- ✅ Fiat withdrawals
- ✅ Crypto deposits & withdrawals
- ✅ Spot trading (via Binance)
- ✅ P2P marketplace
- ✅ Admin dashboard

## Development Status

- ✅ Frontend: Complete
- 🔄 Backend: Phase 1 Complete (Project Setup)
- ⏳ Backend: Phase 2-10 In Progress

## Documentation

See `/docs` folder for detailed API requirements and implementation plans.

## License

Proprietary - Intuition Exchange
