import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import inquiryRoutes from './routes/inquiries.js'
import leadRoutes from './routes/leads.js'
import projectRoutes from './routes/projects.js'
import apiRoutes from './routes/api.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

import { initDb } from './db.js'
await initDb()

if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is missing')
    process.exit(1)
}
if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is missing')
    process.exit(1)
}

console.log('✅ Environment checks passed')

// Middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads')) // Serve uploaded files

import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads'
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
    }
})
const upload = multer({ storage })

// Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    res.json({ url: `/uploads/${req.file.filename}` })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api', apiRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'AppNest API', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
    console.log(`🚀 AppNest API running on http://localhost:${PORT}`)
})
