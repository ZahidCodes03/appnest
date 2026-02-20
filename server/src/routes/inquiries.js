import { Router } from 'express'
import pool from '../db.js'
import { authenticate, adminOnly } from '../middleware/auth.js'

const router = Router()

// Public: Submit inquiry
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, project_type, budget, deadline, message } = req.body
        const result = await pool.query(
            'INSERT INTO inquiries (name, email, phone, project_type, budget, deadline, message) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [name, email, phone, project_type, budget, deadline, message]
        )

        // Notify admin
        try {
            const admin = await pool.query("SELECT id FROM users WHERE role='admin' LIMIT 1")
            if (admin.rows.length > 0) {
                await pool.query(
                    'INSERT INTO notifications (user_id, title, message, type, link) VALUES ($1, $2, $3, $4, $5)',
                    [admin.rows[0].id, 'New Inquiry', `New inquiry from ${name}`, 'info', '/admin/inquiries']
                )
            }
        } catch (noticeErr) {
            console.error('Notification failed:', noticeErr)
        }

        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// Admin: List all inquiries
router.get('/', authenticate, adminOnly, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC')
        res.json(result.rows)
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

// Admin: Update inquiry status
router.patch('/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const { status } = req.body
        const result = await pool.query('UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id])
        res.json(result.rows[0])
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

// Admin: Delete inquiry
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await pool.query('DELETE FROM inquiries WHERE id = $1', [req.params.id])
        res.json({ message: 'Deleted' })
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

export default router
