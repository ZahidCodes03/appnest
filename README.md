# AppNest Technologies Pvt. Ltd

> Full-Stack Agency Website + Admin Panel + Client Portal

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs at http://localhost:5173

### 2. Backend Setup
```bash
cd server
# Copy and edit .env
cp .env.example .env
# Edit DATABASE_URL with your PostgreSQL credentials

npm install
```

### 3. Database Setup
```bash
# Create database
psql -U postgres -c "CREATE DATABASE appnest;"

# Run schema
psql -U postgres -d appnest -f schema.sql

# Seed initial data (admin user + demo data)
npm run seed
```

### 4. Start Backend
```bash
npm run dev
```
Backend runs at http://localhost:5000

## 🔑 Default Login Credentials
| Role   | Email               | Password   |
|--------|---------------------|------------|
| Admin  | admin@appnest.in    | admin@123   |
| Client | rahul@techstart.in  | client123  |

## 📁 Project Structure
```
appnest/
├── client/          # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/   # Shared components (Navbar, Footer, etc.)
│       ├── pages/        # Public website pages
│       ├── admin/        # Admin panel pages
│       ├── portal/       # Client portal pages
│       ├── context/      # Auth context
│       └── lib/          # API helpers
├── server/          # Node.js + Express API
│   └── src/
│       ├── routes/       # API route handlers
│       ├── middleware/   # JWT auth middleware
│       └── db.js         # PostgreSQL connection
└── README.md
```

## 🎨 Features
- **Premium Agency Website** with animated sections
- **Admin Panel** with 11 management pages
- **Client Portal** with 6 features
- **JWT Authentication** with role-based access
- **PostgreSQL Database** with 14 tables
- **Framer Motion** animations
- **Responsive Design** for all devices

## 🌐 Deployment
- **Frontend**: Netlify / Vercel
- **Backend**: Render / Railway
- **Database**: Railway PostgreSQL / Neon

---
© AppNest Technologies Pvt. Ltd
