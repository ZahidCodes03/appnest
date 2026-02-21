import { Router } from 'express'
import pool from '../db.js'
import { authenticate, adminOnly } from '../middleware/auth.js'
import bcrypt from 'bcryptjs'

const router = Router()

/* ===== PORTFOLIO ===== */
router.get('/portfolio', async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM portfolio ORDER BY created_at DESC')).rows) }
    catch { res.status(500).json({ error: 'Server error' }) }
})
router.post('/portfolio', authenticate, adminOnly, async (req, res) => {
    try {
        const { title, tech, category, description, screenshot_url, demo_url } = req.body
        const r = await pool.query('INSERT INTO portfolio (title,tech,category,description,screenshot_url,demo_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [title, tech, category, description, screenshot_url, demo_url])
        res.status(201).json(r.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})
router.delete('/portfolio/:id', authenticate, adminOnly, async (req, res) => {
    try { await pool.query('DELETE FROM portfolio WHERE id=$1', [req.params.id]); res.json({ message: 'Deleted' }) }
    catch { res.status(500).json({ error: 'Server error' }) }
})

/* ===== BLOGS ===== */
router.get('/blogs', async (req, res) => {
    try { res.json((await pool.query("SELECT * FROM blogs WHERE status='published' ORDER BY created_at DESC")).rows) }
    catch { res.status(500).json({ error: 'Server error' }) }
})
// IMPORTANT: /blogs/all MUST be before /blogs/:slug to avoid 'all' being matched as a slug
router.get('/blogs/all', authenticate, adminOnly, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM blogs ORDER BY created_at DESC')).rows) }
    catch { res.status(500).json({ error: 'Server error' }) }
})
router.get('/blogs/:slug', async (req, res) => {
    try {
        const r = await pool.query('SELECT * FROM blogs WHERE slug=$1 AND status=\'published\'', [req.params.slug])
        if (r.rows.length === 0) return res.status(404).json({ error: 'Post not found' })
        res.json(r.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})
router.post('/blogs', authenticate, adminOnly, async (req, res) => {
    try {
        const { title, slug, excerpt, content, status } = req.body
        const r = await pool.query('INSERT INTO blogs (title,slug,excerpt,content,status) VALUES ($1,$2,$3,$4,$5) RETURNING *', [title, slug || title.toLowerCase().replace(/\s+/g, '-'), excerpt, content, status || 'draft'])
        res.status(201).json(r.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})
router.put('/blogs/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const { title, excerpt, content, status } = req.body
        const r = await pool.query('UPDATE blogs SET title=$1,excerpt=$2,content=$3,status=$4,updated_at=NOW() WHERE id=$5 RETURNING *', [title, excerpt, content, status, req.params.id])
        res.json(r.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})
router.delete('/blogs/:id', authenticate, adminOnly, async (req, res) => {
    try { await pool.query('DELETE FROM blogs WHERE id=$1', [req.params.id]); res.json({ message: 'Deleted' }) }
    catch { res.status(500).json({ error: 'Server error' }) }
})

/* ===== TESTIMONIALS ===== */
// Public: get approved testimonials only
router.get('/testimonials', async (req, res) => {
    try { res.json((await pool.query("SELECT * FROM testimonials WHERE approved=TRUE ORDER BY created_at DESC")).rows) }
    catch { res.status(500).json({ error: 'Server error' }) }
})
// Admin: get ALL testimonials (including pending)
router.get('/testimonials/all', authenticate, adminOnly, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC')).rows) }
    catch { res.status(500).json({ error: 'Server error' }) }
})
// Admin: add testimonial (auto-approved)
router.post('/testimonials', authenticate, adminOnly, async (req, res) => {
    try {
        const { name, business, feedback, rating } = req.body
        const r = await pool.query('INSERT INTO testimonials (name,business,feedback,rating,approved) VALUES ($1,$2,$3,$4,TRUE) RETURNING *', [name, business, feedback, rating || 5])
        res.status(201).json(r.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})
// Public: submit a review (saved as unapproved testimonial)
router.post('/testimonials/submit', async (req, res) => {
    try {
        const { name, email, business, feedback, rating } = req.body
        if (!name || !feedback) return res.status(400).json({ error: 'Name and feedback are required' })
        await pool.query('INSERT INTO testimonials (name,email,business,feedback,rating,approved) VALUES ($1,$2,$3,$4,$5,FALSE)', [name, email, business || '', feedback, rating || 5])
        res.status(201).json({ message: 'Thank you! Your review has been submitted and will appear after approval.' })
    } catch { res.status(500).json({ error: 'Server error' }) }
})
// Admin: approve/reject a testimonial
router.patch('/testimonials/:id/approve', authenticate, adminOnly, async (req, res) => {
    try {
        const { approved } = req.body
        const r = await pool.query('UPDATE testimonials SET approved=$1 WHERE id=$2 RETURNING *', [approved !== false, req.params.id])
        if (r.rows.length === 0) return res.status(404).json({ error: 'Not found' })
        res.json(r.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})
router.delete('/testimonials/:id', authenticate, adminOnly, async (req, res) => {
    try { await pool.query('DELETE FROM testimonials WHERE id=$1', [req.params.id]); res.json({ message: 'Deleted' }) }
    catch { res.status(500).json({ error: 'Server error' }) }
})

/* ===== PRICING ===== */
router.get('/pricing', async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM pricing_packages ORDER BY id')).rows) }
    catch { res.status(500).json({ error: 'Server error' }) }
})
router.put('/pricing/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const { name, price, type, features, featured } = req.body
        const r = await pool.query('UPDATE pricing_packages SET name=$1,price=$2,type=$3,features=$4,featured=$5 WHERE id=$6 RETURNING *', [name, price, type, features, featured, req.params.id])
        res.json(r.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})

router.delete('/pricing/:id', authenticate, adminOnly, async (req, res) => {
    try { await pool.query('DELETE FROM pricing_packages WHERE id=$1', [req.params.id]); res.json({ message: 'Deleted' }) }
    catch { res.status(500).json({ error: 'Server error' }) }
})

/* ===== INVOICES ===== */
/* ===== INVOICES ===== */
router.get('/invoices', authenticate, adminOnly, async (req, res) => {
    try {
        const invoices = await pool.query('SELECT * FROM invoices ORDER BY created_at DESC')
        const items = await pool.query('SELECT * FROM invoice_items WHERE invoice_id = ANY($1)', [invoices.rows.map(i => i.id)])

        const result = invoices.rows.map(inv => ({
            ...inv,
            items: items.rows.filter(it => it.invoice_id === inv.id)
        }))
        res.json(result)
    }
    catch { res.status(500).json({ error: 'Server error' }) }
})

router.get('/invoices/mine', authenticate, async (req, res) => {
    try {
        const invoices = await pool.query('SELECT * FROM invoices WHERE client_id=$1 ORDER BY created_at DESC', [req.user.id])
        const items = await pool.query('SELECT * FROM invoice_items WHERE invoice_id = ANY($1)', [invoices.rows.map(i => i.id)])

        const result = invoices.rows.map(inv => ({
            ...inv,
            items: items.rows.filter(it => it.invoice_id === inv.id)
        }))
        res.json(result)
    }
    catch { res.status(500).json({ error: 'Server error' }) }
})

router.post('/invoices', authenticate, adminOnly, async (req, res) => {
    try {
        const { invoice_number, client_id, client_name, total_amount, status, due_date, items } = req.body
        const inv = await pool.query('INSERT INTO invoices (invoice_number,client_id,client_name,total_amount,status,due_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [invoice_number, client_id, client_name, total_amount, status || 'pending', due_date])
        if (items?.length) {
            for (const it of items) {
                await pool.query('INSERT INTO invoice_items (invoice_id,description,quantity,rate,amount) VALUES ($1,$2,$3,$4,$5)', [inv.rows[0].id, it.description, it.quantity, it.rate, it.amount])
            }
        }
        res.status(201).json({ ...inv.rows[0], items })
    } catch (err) { res.status(500).json({ error: 'Server error', details: err.message }) }
})

router.put('/invoices/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const { invoice_number, client_id, client_name, total_amount, status, due_date, items } = req.body

        // Update Invoice Details
        const inv = await pool.query(
            'UPDATE invoices SET invoice_number=$1, client_id=$2, client_name=$3, total_amount=$4, status=$5, due_date=$6 WHERE id=$7 RETURNING *',
            [invoice_number, client_id, client_name, total_amount, status, due_date, req.params.id]
        )

        // Replace Items
        await pool.query('DELETE FROM invoice_items WHERE invoice_id=$1', [req.params.id])
        if (items?.length) {
            for (const it of items) {
                await pool.query('INSERT INTO invoice_items (invoice_id,description,quantity,rate,amount) VALUES ($1,$2,$3,$4,$5)', [req.params.id, it.description, it.quantity, it.rate, it.amount])
            }
        }
        res.json({ ...inv.rows[0], items })
    } catch { res.status(500).json({ error: 'Server error' }) }
})

router.delete('/invoices/:id', authenticate, adminOnly, async (req, res) => {
    try { await pool.query('DELETE FROM invoices WHERE id=$1', [req.params.id]); res.json({ message: 'Deleted' }) }
    catch { res.status(500).json({ error: 'Server error' }) }
})

/* ===== SUPPORT TICKETS ===== */
router.get('/tickets', authenticate, async (req, res) => {
    try {
        const q = req.user.role === 'admin' ? 'SELECT * FROM support_tickets ORDER BY created_at DESC' : 'SELECT * FROM support_tickets WHERE client_id=$1 ORDER BY created_at DESC'
        const params = req.user.role === 'admin' ? [] : [req.user.id]
        res.json((await pool.query(q, params)).rows)
    } catch { res.status(500).json({ error: 'Server error' }) }
})
router.post('/tickets', authenticate, async (req, res) => {
    try {
        const { subject, description, priority } = req.body
        const r = await pool.query('INSERT INTO support_tickets (client_id,subject,description,priority) VALUES ($1,$2,$3,$4) RETURNING *', [req.user.id, subject, description, priority || 'medium'])

        // Notify admin
        try {
            const admin = await pool.query("SELECT id FROM users WHERE role='admin' LIMIT 1")
            if (admin.rows.length > 0) {
                await pool.query(
                    'INSERT INTO notifications (user_id, title, message, type, link) VALUES ($1, $2, $3, $4, $5)',
                    [admin.rows[0].id, 'New Ticket', `Ticket: ${subject}`, 'info', '/admin/tickets']
                )
            }
        } catch (noticeErr) {
            console.error('Notification failed:', noticeErr)
        }

        res.status(201).json(r.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})

router.get('/tickets/:id', authenticate, async (req, res) => {
    try {
        const ticket = await pool.query('SELECT t.*, u.name as client_name FROM support_tickets t JOIN users u ON t.client_id = u.id WHERE t.id=$1', [req.params.id])
        if (ticket.rows.length === 0) return res.status(404).json({ error: 'Ticket not found' })

        if (req.user.role !== 'admin' && ticket.rows[0].client_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' })
        }

        const replies = await pool.query(`
            SELECT r.*, u.name as user_name, u.role as user_role 
            FROM ticket_replies r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.ticket_id=$1 
            ORDER BY r.created_at ASC
        `, [req.params.id])

        res.json({ ...ticket.rows[0], replies: replies.rows })
    } catch { res.status(500).json({ error: 'Server error' }) }
})

router.put('/tickets/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const { status } = req.body
        const r = await pool.query('UPDATE support_tickets SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id])
        res.json(r.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})
router.delete('/tickets/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await pool.query('DELETE FROM ticket_replies WHERE ticket_id=$1', [req.params.id])
        await pool.query('DELETE FROM support_tickets WHERE id=$1', [req.params.id])
        res.json({ message: 'Ticket deleted successfully' })
    } catch { res.status(500).json({ error: 'Server error' }) }
})

router.post('/tickets/:id/reply', authenticate, async (req, res) => {
    try {
        const { message } = req.body
        // Verify access first
        const ticket = await pool.query('SELECT * FROM support_tickets WHERE id=$1', [req.params.id])
        if (ticket.rows.length === 0) return res.status(404).json({ error: 'Ticket not found' })

        if (req.user.role !== 'admin' && ticket.rows[0].client_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' })
        }

        const r = await pool.query('INSERT INTO ticket_replies (ticket_id, user_id, message) VALUES ($1,$2,$3) RETURNING *', [req.params.id, req.user.id, message])

        // Auto update status if client replies? Maybe not.
        // If admin replies, maybe set to 'in_progress' or 'resolved'? 
        // For now, keep it manual status update.

        const reply = await pool.query(`
            SELECT r.*, u.name as user_name, u.role as user_role 
            FROM ticket_replies r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.id=$1
        `, [r.rows[0].id])

        // Notify other party of the reply
        try {
            if (req.user.role !== 'admin') {
                // Client replied, notify admin
                const admin = await pool.query("SELECT id FROM users WHERE role='admin' LIMIT 1")
                if (admin.rows.length > 0) {
                    await pool.query(
                        'INSERT INTO notifications (user_id, title, message, type, link) VALUES ($1, $2, $3, $4, $5)',
                        [admin.rows[0].id, 'New Ticket Reply', `Reply from ${reply.rows[0].user_name}`, 'info', '/admin/tickets']
                    )
                }
            } else {
                // Admin replied, notify client
                await pool.query(
                    'INSERT INTO notifications (user_id, title, message, type, link) VALUES ($1, $2, $3, $4, $5)',
                    [ticket.rows[0].client_id, 'Admin Ticket Reply', `Admin replied to your ticket: ${ticket.rows[0].subject}`, 'info', '/portal/tickets']
                )
            }
        } catch (noticeErr) {
            console.error('Notification failed:', noticeErr)
        }

        res.status(201).json(reply.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})

/* ===== MESSAGES ===== */
router.get('/messages/:userId', authenticate, async (req, res) => {
    try {
        const r = await pool.query('SELECT * FROM messages WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1) ORDER BY created_at ASC', [req.user.id, req.params.userId])
        res.json(r.rows)
    } catch { res.status(500).json({ error: 'Server error' }) }
})

// List conversing clients for Admin
router.get('/admin/conversations', authenticate, adminOnly, async (req, res) => {
    try {
        // Get all unique users who have exchanged messages with the admin (or just all clients who have messages)
        // A simple approach: Get all clients, cross reference with messages table
        const result = await pool.query(`
            SELECT DISTINCT ON (u.id) u.id, u.name, u.email,
            (SELECT text FROM messages m WHERE (m.sender_id = u.id OR m.receiver_id = u.id) ORDER BY m.created_at DESC LIMIT 1) as last_message,
            (SELECT created_at FROM messages m WHERE (m.sender_id = u.id OR m.receiver_id = u.id) ORDER BY m.created_at DESC LIMIT 1) as last_message_time
            FROM users u
            JOIN messages m ON m.sender_id = u.id OR m.receiver_id = u.id
            WHERE u.role = 'client'
        `)
        // Sort in JS because DISTINCT ON requires ORDER BY to match, which makes global sorting hard in one query without a subquery
        const sorted = result.rows.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time))
        res.json(sorted)
    } catch { res.status(500).json({ error: 'Server error' }) }
})

router.post('/messages', authenticate, async (req, res) => {
    try {
        const { receiver_id, text } = req.body
        const r = await pool.query('INSERT INTO messages (sender_id,receiver_id,text) VALUES ($1,$2,$3) RETURNING *', [req.user.id, receiver_id, text])

        // Notify receiver of new message
        try {
            if (req.user.role !== 'admin') {
                // Client sent message, notify admin
                const admin = await pool.query("SELECT id FROM users WHERE role='admin' LIMIT 1")
                if (admin.rows.length > 0) {
                    await pool.query(
                        'INSERT INTO notifications (user_id, title, message, type, link) VALUES ($1, $2, $3, $4, $5)',
                        [admin.rows[0].id, 'New Message', `Message from ${req.user.name}`, 'info', '/admin/messages']
                    )
                }
            } else {
                // Admin sent message, notify client
                await pool.query(
                    'INSERT INTO notifications (user_id, title, message, type, link) VALUES ($1, $2, $3, $4, $5)',
                    [receiver_id, 'New Message from Admin', `Admin sent you a message`, 'info', '/portal/messages']
                )
            }
        } catch (noticeErr) {
            console.error('Notification failed:', noticeErr)
        }

        res.status(201).json(r.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})

/* ===== NOTIFICATIONS ===== */
router.get('/notifications', authenticate, async (req, res) => {
    try {
        const r = await pool.query('SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50', [req.user.id])
        res.json(r.rows)
    } catch { res.status(500).json({ error: 'Server error' }) }
})

router.patch('/notifications/:id/read', authenticate, async (req, res) => {
    try {
        await pool.query('UPDATE notifications SET read=TRUE WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id])
        res.json({ message: 'Marked as read' })
    } catch { res.status(500).json({ error: 'Server error' }) }
})

router.delete('/notifications/clear', authenticate, async (req, res) => {
    try {
        await pool.query('DELETE FROM notifications WHERE user_id=$1', [req.user.id])
        res.json({ message: 'Notifications cleared' })
    } catch { res.status(500).json({ error: 'Server error' }) }
})

/* ===== CLIENTS (admin) ===== */
router.get('/clients', authenticate, adminOnly, async (req, res) => {
    try { res.json((await pool.query("SELECT id, name, email, phone, created_at, (SELECT count(*) FROM projects WHERE client_id=users.id) as projects FROM users WHERE role='client' ORDER BY created_at DESC")).rows) }
    catch { res.status(500).json({ error: 'Server error' }) }
})

router.post('/clients', authenticate, adminOnly, async (req, res) => {
    try {
        const { name, email, password, phone } = req.body
        if (!name || !email || !password) return res.status(400).json({ error: 'Name, Email, and Password are required' })

        const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email])
        if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already exists' })

        const hash = await bcrypt.hash(password, 10)
        const r = await pool.query("INSERT INTO users (name, email, password, role, phone) VALUES ($1, $2, $3, 'client', $4) RETURNING id, name, email, phone, created_at", [name, email, hash, phone])

        res.status(201).json(r.rows[0])
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' })
    }
})

router.put('/clients/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const { name, email, phone, password } = req.body
        let query = 'UPDATE users SET name=$1, email=$2, phone=$3'
        let params = [name, email, phone]

        if (password) {
            const hash = await bcrypt.hash(password, 10)
            query += ', password=$4 WHERE id=$5'
            params.push(hash, req.params.id)
        } else {
            query += ' WHERE id=$4'
            params.push(req.params.id)
        }

        const r = await pool.query(query + ' RETURNING id, name, email, phone, created_at', params)
        if (r.rows.length === 0) return res.status(404).json({ error: 'Client not found' })
        res.json(r.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.delete('/clients/:id', authenticate, adminOnly, async (req, res) => {
    try {
        // Option 1: Just delete (PostgreSQL foreign keys might block if there are projects/invoices)
        // For now, let's just try to delete. If we need to cascade, we should check relations.
        await pool.query('DELETE FROM users WHERE id=$1 AND role=\'client\'', [req.params.id])
        res.json({ message: 'Client deleted' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to delete client. This client may have associated projects, invoices, or tickets.' })
    }
})

/* ===== ADMINS (admin) ===== */
router.get('/admins', authenticate, adminOnly, async (req, res) => {
    try { res.json((await pool.query("SELECT id, name, email, phone, created_at FROM users WHERE role='admin' ORDER BY created_at DESC")).rows) }
    catch { res.status(500).json({ error: 'Server error' }) }
})

router.post('/admins', authenticate, adminOnly, async (req, res) => {
    try {
        const { name, email, password, phone } = req.body
        if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required' })

        const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email])
        if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already exists' })

        const hash = await bcrypt.hash(password, 10)
        const r = await pool.query("INSERT INTO users (name, email, password, role, phone) VALUES ($1, $2, $3, 'admin', $4) RETURNING id, name, email, phone, created_at", [name, email, hash, phone])

        res.status(201).json(r.rows[0])
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' })
    }
})

router.put('/admins/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const { name, email, phone, password } = req.body
        let query = 'UPDATE users SET name=$1, email=$2, phone=$3'
        let params = [name, email, phone]

        if (password) {
            const hash = await bcrypt.hash(password, 10)
            query += ', password=$4 WHERE id=$5'
            params.push(hash, req.params.id)
        } else {
            query += ' WHERE id=$4'
            params.push(req.params.id)
        }

        const r = await pool.query(query + ' RETURNING id, name, email, phone, created_at', params)
        if (r.rows.length === 0) return res.status(404).json({ error: 'Admin not found' })
        res.json(r.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.delete('/admins/:id', authenticate, adminOnly, async (req, res) => {
    try {
        // Prevent self-deletion
        if (req.params.id == req.user.id) {
            return res.status(400).json({ error: 'You cannot delete your own account' })
        }
        await pool.query('DELETE FROM users WHERE id=$1 AND role=\'admin\'', [req.params.id])
        res.json({ message: 'Admin deleted' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to delete admin.' })
    }
})

/* ===== DASHBOARD STATS ===== */
router.get('/admin/dashboard', authenticate, adminOnly, async (req, res) => {
    try {
        const inquiries = await pool.query('SELECT count(*) FROM inquiries')
        const projects = await pool.query('SELECT count(*) FROM projects WHERE status != \'Completed\'')
        const clients = await pool.query("SELECT count(*) FROM users WHERE role='client'")
        const revenue = await pool.query('SELECT sum(total_amount) FROM invoices WHERE status=\'paid\'')

        const recentInquiries = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5')
        const recentProjects = await pool.query('SELECT p.*, u.name as client_name FROM projects p LEFT JOIN users u ON p.client_id = u.id ORDER BY p.created_at DESC LIMIT 5')
        const recentTickets = await pool.query('SELECT t.*, u.name as client_name FROM support_tickets t LEFT JOIN users u ON t.client_id = u.id ORDER BY t.created_at DESC LIMIT 5')
        const recentMessages = await pool.query('SELECT m.*, u.name as sender_name FROM messages m LEFT JOIN users u ON m.sender_id = u.id WHERE m.receiver_id = $1 ORDER BY m.created_at DESC LIMIT 5', [req.user.id])
        const pendingApprovals = await pool.query('SELECT count(*) FROM invoices WHERE status=\'under_review\'')

        res.json({
            stats: {
                inquiries: inquiries.rows[0].count,
                active_projects: projects.rows[0].count,
                total_clients: clients.rows[0].count,
                revenue: revenue.rows[0].sum || 0,
                pending_approvals: pendingApprovals.rows[0].count
            },
            recent_inquiries: recentInquiries.rows,
            recent_projects: recentProjects.rows,
            recent_tickets: recentTickets.rows,
            recent_messages: recentMessages.rows
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/client/dashboard', authenticate, async (req, res) => {
    try {
        const projects = await pool.query('SELECT count(*) FROM projects WHERE client_id=$1 AND status != \'Completed\'', [req.user.id])
        const invoices = await pool.query('SELECT count(*) FROM invoices WHERE client_id=$1 AND status=\'pending\'', [req.user.id])
        const completed = await pool.query('SELECT count(*) FROM projects WHERE client_id=$1 AND status=\'Completed\'', [req.user.id])

        // Mock activity for now as we don't have an activity log table developed yet
        // In a real app, you'd fetch from an 'activities' table
        const recentActivity = [
            { text: 'Welcome to your dashboard', time: 'Just now', type: 'system' }
        ]

        res.json({
            stats: {
                active_projects: projects.rows[0].count,
                pending_invoices: invoices.rows[0].count,
                completed_projects: completed.rows[0].count,
                in_progress: projects.rows[0].count // Assuming active = in progress for simplicity
            },
            recent_activity: recentActivity
        })
    } catch { res.status(500).json({ error: 'Server error' }) }
})

/* ===== COMPANY SETTINGS ===== */
router.get('/settings', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM company_settings')
        const settings = rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {})
        res.json(settings)
    } catch { res.status(500).json({ error: 'Server error' }) }
})
router.post('/settings', authenticate, adminOnly, async (req, res) => {
    try {
        for (const [key, value] of Object.entries(req.body)) {
            await pool.query('INSERT INTO company_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()', [key, value])
        }
        res.json({ message: 'Settings saved' })
    } catch { res.status(500).json({ error: 'Server error' }) }
})

/* ===== DELIVERABLES ===== */
router.get('/deliverables', authenticate, adminOnly, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT d.*, p.name as project_name 
            FROM deliverables d 
            JOIN projects p ON d.project_id = p.id 
            ORDER BY d.created_at DESC
        `)
        res.json(result.rows)
    } catch { res.status(500).json({ error: 'Server error' }) }
})

router.get('/deliverables/mine', authenticate, async (req, res) => {
    try {
        // Fetch deliverables for any project owned by the user
        const result = await pool.query(`
            SELECT d.*, p.name as project_name 
            FROM deliverables d 
            JOIN projects p ON d.project_id = p.id 
            WHERE p.client_id = $1 
            ORDER BY d.created_at DESC
        `, [req.user.id])
        res.json(result.rows)
    } catch { res.status(500).json({ error: 'Server error' }) }
})
router.get('/deliverables/:projectId', authenticate, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM deliverables WHERE project_id=$1 ORDER BY created_at DESC', [req.params.projectId])).rows) }
    catch { res.status(500).json({ error: 'Server error' }) }
})
router.post('/deliverables', authenticate, adminOnly, async (req, res) => {
    try {
        const { project_id, title, file_url } = req.body
        const r = await pool.query('INSERT INTO deliverables (project_id, title, file_url) VALUES ($1, $2, $3) RETURNING *', [project_id, title, file_url])

        // Notify client
        const project = await pool.query('SELECT client_id, name FROM projects WHERE id = $1', [project_id])
        if (project.rows.length > 0) {
            await pool.query('INSERT INTO notifications (user_id, title, message, type, link) VALUES ($1, $2, $3, $4, $5)', [
                project.rows[0].client_id,
                'New Deliverable Added',
                `A new deliverable "${title}" has been added to project "${project.rows[0].name}"`,
                'success',
                '/portal/deliverables'
            ])
        }

        res.status(201).json(r.rows[0])
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' })
    }
})
router.delete('/deliverables/:id', authenticate, adminOnly, async (req, res) => {
    try { await pool.query('DELETE FROM deliverables WHERE id=$1', [req.params.id]); res.json({ message: 'Deleted' }) }
    catch { res.status(500).json({ error: 'Server error' }) }
})

/* ===== PROJECTS (Edit) ===== */
router.put('/projects/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const { name, client_id, status, progress, deadline } = req.body
        const r = await pool.query('UPDATE projects SET name=$1, client_id=$2, status=$3, progress=$4, deadline=$5 WHERE id=$6 RETURNING *', [name, client_id, status, progress, deadline, req.params.id])
        res.json(r.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})

/* ===== INVOICES (Edit) ===== */
router.get('/invoices/:id/status', authenticate, async (req, res) => {
    try {
        const inv = await pool.query('SELECT status FROM invoices WHERE id=$1', [req.params.id])
        if (inv.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' })

        // Verify ownership if client
        if (req.user.role !== 'admin') {
            const ownership = await pool.query('SELECT client_id FROM invoices WHERE id=$1', [req.params.id])
            if (ownership.rows[0].client_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' })
        }

        res.json({ status: inv.rows[0].status })
    } catch (err) {
        console.error('Get status error:', err)
        res.status(500).json({ error: 'Server error', details: err.message })
    }
})


router.patch('/invoices/:id/status', authenticate, adminOnly, async (req, res) => {
    try {
        const { status } = req.body
        const r = await pool.query('UPDATE invoices SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id])
        res.json(r.rows[0])
    } catch (err) {
        console.error('Update status error:', err)
        res.status(500).json({ error: 'Server error', details: err.message })
    }
})

router.post('/invoices/:id/pay', authenticate, async (req, res) => {
    try {
        const { transaction_id } = req.body
        if (!transaction_id) return res.status(400).json({ error: 'Transaction ID is required' })

        // Verify ownership if client
        if (req.user.role !== 'admin') {
            const inv = await pool.query('SELECT client_id FROM invoices WHERE id=$1', [req.params.id])
            if (inv.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' })
            if (inv.rows[0].client_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' })
        }

        const r = await pool.query('UPDATE invoices SET status=\'under_review\', transaction_id=$1 WHERE id=$2 RETURNING *', [transaction_id, req.params.id])

        // Notify admin
        const admin = await pool.query('SELECT id FROM users WHERE role=\'admin\' LIMIT 1')
        if (admin.rows.length) {
            await pool.query('INSERT INTO notifications (user_id, title, message, type, link) VALUES ($1, $2, $3, $4, $5)', [
                admin.rows[0].id,
                'New Payment Submitted',
                `Client ${r.rows[0].client_name} submitted payment for invoice ${r.rows[0].invoice_number}`,
                'payment',
                `/admin/invoices`
            ])
        }

        res.json(r.rows[0])
    } catch (err) {
        console.error('Payment error:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.patch('/invoices/:id/approve', authenticate, adminOnly, async (req, res) => {
    try {
        const inv = await pool.query('UPDATE invoices SET status=\'paid\' WHERE id=$1 RETURNING *', [req.params.id])
        if (inv.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' })

        // Notify client
        await pool.query('INSERT INTO notifications (user_id, title, message, type, link) VALUES ($1, $2, $3, $4, $5)', [
            inv.rows[0].client_id,
            'Payment Approved',
            `Your payment for invoice ${inv.rows[0].invoice_number} has been approved.`,
            'success',
            `/portal/invoices`
        ])

        res.json(inv.rows[0])
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})

router.patch('/invoices/:id/reject', authenticate, adminOnly, async (req, res) => {
    try {
        const { reason } = req.body
        const inv = await pool.query('UPDATE invoices SET status=\'pending\', transaction_id=NULL WHERE id=$1 RETURNING *', [req.params.id])
        if (inv.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' })

        // Notify client
        await pool.query('INSERT INTO notifications (user_id, title, message, type, link) VALUES ($1, $2, $3, $4, $5)', [
            inv.rows[0].client_id,
            'Payment Rejected',
            `Your payment for invoice ${inv.rows[0].invoice_number} was rejected. ${reason ? 'Reason: ' + reason : ''}`,
            'error',
            `/portal/invoices`
        ])

        res.json(inv.rows[0])
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})



/* ===== JOB POSTINGS ===== */
router.get('/jobs', async (req, res) => {
    try { res.json((await pool.query("SELECT * FROM job_postings WHERE status='active' ORDER BY created_at DESC")).rows) }
    catch { res.status(500).json({ error: 'Server error' }) }
})
router.get('/jobs/all', authenticate, adminOnly, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM job_postings ORDER BY created_at DESC')).rows) }
    catch { res.status(500).json({ error: 'Server error' }) }
})
router.post('/jobs', authenticate, adminOnly, async (req, res) => {
    try {
        const { title, category, type, location, description, requirements, salary_range, vacancy_count } = req.body
        const r = await pool.query('INSERT INTO job_postings (title,category,type,location,description,requirements,salary_range,vacancy_count) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *', [title, category, type || 'Full-time', location || 'Remote', description, requirements, salary_range, vacancy_count || 1])
        res.status(201).json(r.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})
router.put('/jobs/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const { title, category, type, location, description, requirements, salary_range, vacancy_count, status } = req.body
        const r = await pool.query('UPDATE job_postings SET title=$1,category=$2,type=$3,location=$4,description=$5,requirements=$6,salary_range=$7,vacancy_count=$8,status=$9 WHERE id=$10 RETURNING *', [title, category, type, location, description, requirements, salary_range, vacancy_count || 1, status, req.params.id])
        res.json(r.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})
router.delete('/jobs/:id', authenticate, adminOnly, async (req, res) => {
    try { await pool.query('DELETE FROM job_postings WHERE id=$1', [req.params.id]); res.json({ message: 'Deleted' }) }
    catch { res.status(500).json({ error: 'Server error' }) }
})

/* ===== JOB APPLICATIONS ===== */
router.get('/applications', authenticate, adminOnly, async (req, res) => {
    try {
        const r = await pool.query('SELECT a.*, j.title as job_title FROM job_applications a LEFT JOIN job_postings j ON a.job_id = j.id ORDER BY a.applied_at DESC')
        res.json(r.rows)
    } catch { res.status(500).json({ error: 'Server error' }) }
})
router.post('/applications', async (req, res) => {
    try {
        const { job_id, full_name, email, phone, resume_url, cover_letter, portfolio_url } = req.body
        if (!full_name || !email || !resume_url) return res.status(400).json({ error: 'Required fields missing' })
        const r = await pool.query('INSERT INTO job_applications (job_id,full_name,email,phone,resume_url,cover_letter,portfolio_url) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [job_id, full_name, email, phone, resume_url, cover_letter, portfolio_url])

        // Notify admin
        try {
            const admin = await pool.query("SELECT id FROM users WHERE role='admin' LIMIT 1")
            if (admin.rows.length > 0) {
                const jobTitle = job_id ? (await pool.query('SELECT title FROM job_postings WHERE id=$1', [job_id])).rows[0]?.title : 'General Application'
                await pool.query(
                    'INSERT INTO notifications (user_id, title, message, type, link) VALUES ($1, $2, $3, $4, $5)',
                    [admin.rows[0].id, 'New Job Application', `Application from ${full_name} for ${jobTitle}`, 'info', '/admin/applications']
                )
            }
        } catch (noticeErr) { console.error('Notification failed:', noticeErr) }

        res.status(201).json(r.rows[0])
    } catch (err) { res.status(500).json({ error: 'Server error' }) }
})
router.patch('/applications/:id/status', authenticate, adminOnly, async (req, res) => {
    try {
        const { status } = req.body
        const r = await pool.query('UPDATE job_applications SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id])
        res.json(r.rows[0])
    } catch { res.status(500).json({ error: 'Server error' }) }
})
router.delete('/applications/:id', authenticate, adminOnly, async (req, res) => {
    try { await pool.query('DELETE FROM job_applications WHERE id=$1', [req.params.id]); res.json({ message: 'Deleted' }) }
    catch { res.status(500).json({ error: 'Server error' }) }
})

export default router
