import { Router } from 'express'
import pool from '../db.js'
import { authenticate, adminOnly } from '../middleware/auth.js'

const router = Router()

// Public: Capture email
router.post('/', async (req, res) => {
    try {
        const { email } = req.body
        await pool.query('INSERT INTO leads (email) VALUES ($1)', [email])
        res.status(201).json({ message: 'Email captured' })
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

// Admin: List all leads
router.get('/', authenticate, adminOnly, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC')
        res.json(result.rows)
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

// Admin: Delete lead
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await pool.query('DELETE FROM leads WHERE id = $1', [req.params.id])
        res.json({ message: 'Deleted' })
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

export default router
