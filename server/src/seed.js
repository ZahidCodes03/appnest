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
            await pool.query('INSERT INTO pricing_packages (name, price, type, features, featured) VALUES ($1,$2,$3,$4,$5)', [name, price, type, features, featured])
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
