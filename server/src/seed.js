import bcrypt from 'bcryptjs'
import pool from './db.js'
import dotenv from 'dotenv'

dotenv.config()

async function seed() {
    console.log('🌱 Seeding database...')

    try {
        // Create admin user
        const adminHash = await bcrypt.hash('Admin@123', 10)
        await pool.query(
            `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password`,
            ['Admin', 'admin@appnest.in', adminHash, 'admin']
        )

        // Create demo client
        const clientHash = await bcrypt.hash('client123', 10)
        await pool.query(
            `INSERT INTO users (name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING`,
            ['Rahul Verma', 'rahul@techstart.in', clientHash, 'client', '+91 6006 642157']
        )

        // Seed testimonials
        const testimonials = [
            ['Rohit Sharma', 'TechStart Handwara Jammu & Kashmir ', 'AppNest delivered our e-commerce platform on time with exceptional quality.', 5],
            ['Priya Patel', 'GreenSolar Solutions', 'Our IoT dashboard was a complex project. AppNest understood our needs perfectly.', 5],
            ['Amit Kumar', 'EduLearn Academy', 'The LMS they built for us transformed our online education delivery.', 5],
        ]
        for (const [name, business, feedback, rating] of testimonials) {
            await pool.query('INSERT INTO testimonials (name, business, feedback, rating) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING', [name, business, feedback, rating])
        }

        // Seed pricing
        const pkgs = [
            ['Basic Website', '₹15,000', 'One Time', ['5 Pages Responsive Website', 'Contact Form', 'SEO Optimized', 'Mobile Friendly', '1 Month Free Support', 'SSL Certificate'], false],
            ['Business Website', '₹35,000', 'One Time', ['10+ Pages Dynamic Website', 'Admin Panel', 'Advanced SEO', 'Blog Integration', 'Social Media Integration', '3 Months Free Support', 'SSL + Analytics'], true],
            ['App Development', 'Custom', 'Get a Quote', ['Android & iOS App', 'Custom UI/UX Design', 'Backend API', 'Push Notifications', 'Payment Integration', '6 Months Support', 'App Store Deployment'], false],
        ]
        for (const [name, price, type, features, featured] of pkgs) {
            await pool.query('INSERT INTO pricing_packages (name, price, type, features, featured) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING', [name, price, type, features, featured])
        }

        // Seed portfolio
        const projects = [
            ['Modern E-Commerce', 'React, Node.js, PostgreSQL', 'Web Development', 'A full-featured online store with payment gateway integration and real-time inventory.', 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80', 'https://example.com'],
            ['HealthSync App', 'React Native, Firebase', 'Mobile App', 'Comprehensive health tracking app with telemedicine integration and live consultation.', 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80', 'https://example.com'],
            ['EduPro LMS', 'Next.js, Tailwind, Prisma', 'Web Application', 'Institutional learning management system with video streaming and interactive quizzes.', 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80', 'https://example.com'],
        ]
        for (const [title, tech, category, description, screenshot_url, demo_url] of projects) {
            await pool.query('INSERT INTO portfolio (title, tech, category, description, screenshot_url, demo_url) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING', [title, tech, category, description, screenshot_url, demo_url])
        }

        console.log('✅ Seeding complete!')
        console.log('   Admin: admin@appnest.in / admin@123')
        console.log('   Client: rahul@techstart.in / client123')
        process.exit(0)
    } catch (err) {
        console.error('❌ Seeding failed:', err)
        process.exit(1)
    }
}

seed()
