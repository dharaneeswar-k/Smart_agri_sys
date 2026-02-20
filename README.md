# Agri Market Intelligence & Smart Selling System

A comprehensive MERN stack application connecting farmers to markets with AI-driven insights.

## Features
- **Real-Time Prices**: Live market rates from nearby mandis.
- **Smart Selling**: AI recommendations (Sell Now vs Store).
- **Marketplace**: Direct farmer-to-buyer selling.
- **Analytics**: Price trend visualization.
- **Role-Based**: Dashboards for Farmers, Buyers, and Admins.

## Tech Stack
- **Frontend**: React (Vite), Redux Toolkit, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express, MongoDB, Socket.io
- **DevOps**: Docker

## Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI (provided in .env)

## Setup Instructions

### 1. Clone & Install
```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### 2. Environment Variables
Ensure `server/.env` exists with:
```
MONGO_URI=mongodb+srv://dharaneeswar07_db_user:DFdF8RjkIRvbD5Dt@cluster0.7esorcz.mongodb.net/smart_agri_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=supersecret
PORT=5000
```

### 3. Seed Data (Optional)
Populate the database with sample users and markets:
```bash
cd server
npm run seed
```
*Note: This creates a default farmer (email: farmer@example.com / password: password123)*

### 4. Run Application
**Development Mode:**
```bash
# Terminal 1 (Backend)
cd server
npm run dev

# Terminal 2 (Frontend)
cd client
npm run dev
```

**Docker:**
```bash
docker-compose up --build
```

## API Documentation
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/markets` - Get all markets
- `GET /api/prices` - Get market prices
- `POST /api/listings` - Create listing
- `POST /api/recommendations/smart-sell` - Get AI advice

## License
MIT
