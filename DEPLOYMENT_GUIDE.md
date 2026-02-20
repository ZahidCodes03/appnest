# AppNest Technologies — Full Deployment Guide

Complete step-by-step guide for deploying AppNest on **Render** (backend + PostgreSQL) and **Netlify** (frontend).

---

## 1. PostgreSQL Database on Render

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **PostgreSQL**
2. Fill in:
   - **Name**: `appnest-db`
   - **Database**: `appnest`
   - **User**: `appnest_user`
   - **Region**: Choose closest to your users (e.g., Oregon)
   - **Plan**: Free (or Starter for production)
3. Click **Create Database**
4. Copy the **Internal Database URL** (for the backend on Render) — it looks like:
   ```
   postgresql://appnest_user:PASSWORD@dpg-xxxxx-a.oregon-postgres.render.com/appnest
   ```
5. **Run the schema**: Go to the **Shell** tab or use `psql` with the External Database URL and run the contents of `server/schema.sql`:
   ```bash
   psql "YOUR_EXTERNAL_DATABASE_URL" -f schema.sql
   ```

---

## 2. Backend Deployment on Render

1. Push your `server/` code to a GitHub repo (or the full monorepo)
2. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `appnest-api`
   - **Region**: Same as database
   - **Root Directory**: `server` (if monorepo)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables** (add all of these):

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | `postgresql://appnest_user:PASSWORD@dpg-xxxxx-a.oregon-postgres.render.com/appnest` (Internal URL from step 1) |
   | `PORT` | `10000` (Render uses this by default) |
   | `JWT_SECRET` | A strong random string (e.g., `openssl rand -hex 32`) |
   | `FRONTEND_URL` | `https://your-app.netlify.app` (your Netlify URL) |
   | `NODE_ENV` | `production` |

6. Click **Create Web Service**
7. Wait for deployment — note your backend URL: `https://appnest-api.onrender.com`

---

## 3. Frontend Deployment on Netlify

1. Push your `client/` code to a GitHub repo
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Connect your GitHub repo
4. Configure build settings:
   - **Base directory**: `client` (if monorepo)
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
5. **Environment Variables**:

   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://appnest-api.onrender.com` (your Render backend URL, **no trailing slash**) |

6. Click **Deploy site**
7. After deploy, go to **Site settings** → **Domain management** to add a custom domain if desired.

> **Note:** The `_redirects` file in `public/` ensures React Router works correctly. It contains:
> ```
> /*    /index.html   200
> ```
> This prevents 404 on page refresh for routes like `/admin`, `/portal`, `/blog/slug`.

---

## 4. Complete PostgreSQL Schema SQL

Run this SQL on your Render PostgreSQL database to create all tables:

```sql
-- Users (Admin + Client)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  project_type VARCHAR(100),
  budget VARCHAR(100),
  deadline VARCHAR(100),
  message TEXT,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  client_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  deadline DATE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio
CREATE TABLE IF NOT EXISTS portfolio (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  tech VARCHAR(500),
  category VARCHAR(100),
  description TEXT,
  screenshot_url VARCHAR(500),
  demo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  business VARCHAR(255),
  feedback TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Client Reviews (Public Submissions)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  feedback TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pricing Packages
CREATE TABLE IF NOT EXISTS pricing_packages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(100) NOT NULL,
  type VARCHAR(100),
  features TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  client_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  client_name VARCHAR(255),
  total_amount DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'under_review')),
  due_date DATE,
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invoice Items
CREATE TABLE IF NOT EXISTS invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
  description VARCHAR(500) NOT NULL,
  quantity INTEGER DEFAULT 1,
  rate DECIMAL(12,2) DEFAULT 0,
  amount DECIMAL(12,2) DEFAULT 0
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id) ON DELETE SET NULL,
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ticket Replies
CREATE TABLE IF NOT EXISTS ticket_replies (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deliverables
CREATE TABLE IF NOT EXISTS deliverables (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Settings
CREATE TABLE IF NOT EXISTS company_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin user (change password after first login!)
INSERT INTO users (name, email, password, role) VALUES (
  'Admin',
  'admin@appnest.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: 'password'
  'admin'
) ON CONFLICT (email) DO NOTHING;
```

> **IMPORTANT:** After running the schema, change the admin password immediately by logging in and updating it, or by generating a new bcrypt hash.

---

## 5. Environment Variables Summary

### Render Backend (`server/`)
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Render PostgreSQL Internal URL | `postgresql://user:pass@host/db` |
| `PORT` | Server port (Render provides this) | `10000` |
| `JWT_SECRET` | Secret key for JWT tokens | `a7f3b...long-random-string` |
| `FRONTEND_URL` | Netlify frontend URL | `https://appnest.netlify.app` |
| `NODE_ENV` | Environment | `production` |

### Netlify Frontend (`client/`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Render backend URL (no trailing slash) | `https://appnest-api.onrender.com` |

---

## 6. Final Deployment Checklist

- [ ] GitHub repo has latest code pushed
- [ ] Render PostgreSQL created and schema SQL executed
- [ ] Admin user exists in database
- [ ] Render Web Service deployed with all 5 env variables
- [ ] Backend health check works: `https://appnest-api.onrender.com/api/health`
- [ ] Netlify site deployed with `VITE_API_URL` set
- [ ] `_redirects` file is in `client/public/` (included in build)
- [ ] Website homepage loads correctly
- [ ] Admin login works at `/login`
- [ ] Admin blog CRUD works (create, publish, delete)
- [ ] Admin testimonials CRUD works (fetched from DB)
- [ ] Testimonials appear on homepage (from API)
- [ ] Review form on homepage submits successfully
- [ ] WhatsApp button opens chat with +916006642157
- [ ] Page refresh on any route works (no 404)
- [ ] Footer phone number links to correct number

---

## 7. Troubleshooting

| Issue | Solution |
|-------|----------|
| `Failed to fetch blogs` in admin | Check `VITE_API_URL` is set correctly on Netlify (no trailing slash) |
| CORS error in browser | Ensure `FRONTEND_URL` on Render matches your Netlify domain exactly |
| Database connection error | Ensure `DATABASE_URL` uses the **Internal** URL (not External) on Render |
| 404 on page refresh (Netlify) | Verify `_redirects` file exists in `client/public/` |
| Backend crashes on startup | Check Render logs — usually missing env variables |
| SSL connection error | `NODE_ENV` must be set to `production` for SSL to activate |
