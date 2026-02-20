import { Router } from 'express'
import pool from '../db.js'
import { authenticate, adminOnly } from '../middleware/auth.js'

const router = Router()

// Admin: Create project
router.post('/', authenticate, adminOnly, async (req, res) => {
    try {
        const { name, client_id, status, progress, deadline, description } = req.body
        const result = await pool.query(
            'INSERT INTO projects (name, client_id, status, progress, deadline, description) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            [name, client_id, status || 'planning', progress || 0, deadline, description]
        )
        res.status(201).json(result.rows[0])
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

// Public: Get Admin ID (for messaging)
router.get('/admin-contact', authenticate, async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name FROM users WHERE role='admin' LIMIT 1")
        if (result.rows.length === 0) return res.status(404).json({ error: 'No admin found' })
        res.json(result.rows[0])
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

// Admin: List all projects
router.get('/', authenticate, adminOnly, async (req, res) => {
    try {
        const result = await pool.query('SELECT p.*, u.name as client_name FROM projects p LEFT JOIN users u ON p.client_id = u.id ORDER BY p.created_at DESC')
        res.json(result.rows)
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

// Client: My projects
router.get('/mine', authenticate, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects WHERE client_id = $1 ORDER BY created_at DESC', [req.user.id])
        res.json(result.rows)
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

// Admin: Update project
router.put('/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const { name, client_id, status, progress, deadline, description } = req.body
        const result = await pool.query(
            'UPDATE projects SET name=$1, client_id=$2, status=$3, progress=$4, deadline=$5, description=$6 WHERE id=$7 RETURNING *',
            [name, client_id, status, progress, deadline, description, req.params.id]
        )
        res.json(result.rows[0])
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

// Admin: Delete project
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id])
        res.json({ message: 'Deleted' })
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

export default router
