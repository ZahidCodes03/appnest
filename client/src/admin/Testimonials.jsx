import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlinePlus, HiOutlineTrash, HiOutlineStar, HiOutlineCheck, HiOutlineX } from 'react-icons/hi'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Testimonials() {
    const [items, setItems] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', business: '', feedback: '', rating: 5 })
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all | pending | approved

    const fetchTestimonials = async () => {
        try {
            const { data } = await api.get('/testimonials/all')
            setItems(data)
        } catch (error) {
            toast.error('Failed to fetch testimonials')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const handleAdd = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.post('/testimonials', { ...form, rating: Number(form.rating) })
            setItems([data, ...items])
            setForm({ name: '', business: '', feedback: '', rating: 5 })
            setShowForm(false)
            toast.success('Testimonial added')
        } catch (error) {
            toast.error('Failed to add testimonial')
        }
    }

    const handleApprove = async (id, approved) => {
        try {
            await api.patch(`/testimonials/${id}/approve`, { approved })
            setItems(items.map((t) => t.id === id ? { ...t, approved } : t))
            toast.success(approved ? 'Approved — now visible on homepage' : 'Rejected — hidden from homepage')
        } catch {
            toast.error('Failed to update')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this testimonial?')) return
        try {
            await api.delete(`/testimonials/${id}`)
            setItems(items.filter((x) => x.id !== id))
            toast.success('Deleted')
        } catch (error) {
            toast.error('Failed to delete')
        }
    }

    const filtered = items.filter((t) => {
        if (filter === 'pending') return !t.approved
        if (filter === 'approved') return t.approved
        return true
    })

    const pendingCount = items.filter((t) => !t.approved).length

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <p className="text-gray-600 text-sm">{items.length} testimonials</p>
                    {pendingCount > 0 && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse">
                            {pendingCount} pending approval
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                        {['all', 'pending', 'approved'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm !py-2 !px-4"><HiOutlinePlus className="w-4 h-4" /> Add</button>
                </div>
            </div>

            {showForm && (
                <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-100 p-6 grid sm:grid-cols-2 gap-4">
                    <input required placeholder="Client name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                    <input required placeholder="Business name" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                    <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm">
                        {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                    <div />
                    <textarea required placeholder="Feedback..." value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm sm:col-span-2 resize-none" rows={3} />
                    <div className="flex gap-2">
                        <button type="submit" className="btn-primary text-sm !py-2">Save</button>
                        <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm !py-2">Cancel</button>
                    </div>
                </motion.form>
            )}

            {loading ? (
                <div className="p-8 text-center text-gray-500">Loading testimonials...</div>
            ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                    {filter === 'pending' ? 'No pending reviews.' : filter === 'approved' ? 'No approved testimonials.' : 'No testimonials yet.'}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((t, i) => (
                        <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                            className={`bg-white rounded-2xl border p-5 hover:shadow-md transition-shadow ${t.approved ? 'border-gray-100' : 'border-yellow-200 bg-yellow-50/30'}`}>
                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900 text-sm">{t.name}</span>
                                        {t.business && <span className="text-gray-400 text-xs">• {t.business}</span>}
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${t.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {t.approved ? 'Live' : 'Pending'}
                                        </span>
                                    </div>
                                    {t.email && <div className="text-gray-400 text-xs mb-1">{t.email}</div>}
                                    <div className="flex gap-0.5 mb-2">
                                        {[...Array(t.rating)].map((_, j) => <HiOutlineStar key={j} className="w-4 h-4 text-yellow-400 fill-current" />)}
                                    </div>
                                    <p className="text-gray-600 text-sm">"{t.feedback}"</p>
                                </div>
                                <div className="flex sm:flex-col gap-2 shrink-0">
                                    {!t.approved ? (
                                        <button onClick={() => handleApprove(t.id, true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 text-xs font-medium transition-colors">
                                            <HiOutlineCheck className="w-4 h-4" /> Approve
                                        </button>
                                    ) : (
                                        <button onClick={() => handleApprove(t.id, false)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-50 text-yellow-600 hover:bg-yellow-100 text-xs font-medium transition-colors">
                                            <HiOutlineX className="w-4 h-4" /> Hide
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(t.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 text-xs font-medium transition-colors">
                                        <HiOutlineTrash className="w-4 h-4" /> Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
