import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlinePlus, HiOutlineChatAlt2, HiOutlineX, HiOutlinePaperAirplane } from 'react-icons/hi'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function SupportTickets() {
    const [tickets, setTickets] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ subject: '', description: '', priority: 'medium' })
    const [loading, setLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [reply, setReply] = useState('')
    const [sending, setSending] = useState(false)
    const { user } = useAuth()

    const fetchTickets = async () => {
        try {
            const { data } = await api.get('/tickets')
            setTickets(data)
        } catch { toast.error('Failed to fetch tickets') }
        finally { setLoading(false) }
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post('/tickets', form)
            toast.success('Ticket created! We\'ll respond within 24 hours.')
            setForm({ subject: '', description: '', priority: 'medium' })
            setShowForm(false)
            fetchTickets()
        } catch { toast.error('Failed to create ticket') }
    }

    const openTicket = async (ticket) => {
        try {
            const { data } = await api.get(`/tickets/${ticket.id}`)
            setSelectedTicket(data)
        } catch { toast.error('Failed to load ticket details') }
    }

    const sendReply = async (e) => {
        e.preventDefault()
        if (!reply.trim()) return

        setSending(true)
        try {
            const { data } = await api.post(`/tickets/${selectedTicket.id}/reply`, { message: reply })
            setSelectedTicket(prev => ({ ...prev, replies: [...prev.replies, data] }))
            setReply('')
            toast.success('Reply sent')
        } catch { toast.error('Failed to send reply') }
        finally { setSending(false) }
    }

    const statusColors = { open: 'bg-violet-100 text-violet-700', in_progress: 'bg-amber-100 text-amber-700', resolved: 'bg-green-100 text-green-700' }
    const priorityColors = { low: 'text-gray-500', medium: 'text-amber-600', high: 'text-red-600' }

    if (loading) return <div className="text-center p-8">Loading tickets...</div>

    return (
        <div className="space-y-4 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
                    <p className="text-gray-600 text-sm">{tickets.length} tickets</p>
                </div>
                {!selectedTicket && (
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm !py-2 !px-4"><HiOutlinePlus className="w-4 h-4" /> New Ticket</button>
                )}
            </div>

            <div className="flex-1 overflow-hidden flex gap-6 relative">
                {/* Tickets List */}
                <div className={`flex-1 bg-white rounded-2xl border border-gray-100 overflow-y-auto ${selectedTicket ? 'hidden md:block md:w-1/3 md:flex-none' : 'w-full'} ${showForm ? 'hidden' : ''}`}>
                    {tickets.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No tickets found</div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {tickets.map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => openTicket(t)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedTicket?.id === t.id ? 'bg-violet-50' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-medium text-sm ${selectedTicket?.id === t.id ? 'text-violet-900' : 'text-gray-900'}`}>{t.subject}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status]}`}>{t.status.replace('_', ' ')}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{t.description}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-400">
                                        <span>{new Date(t.created_at).toLocaleDateString()}</span>
                                        <span className={priorityColors[t.priority]}>{t.priority}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* New Ticket Form */}
                <AnimatePresence>
                    {showForm && !selectedTicket && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 bg-white rounded-2xl border border-gray-100 p-6 z-10 overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Create New Ticket</h2>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><HiOutlineX className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input required placeholder="Brief summary of the issue" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea required placeholder="Describe your issue in detail..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm resize-none" rows={6} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm">
                                        <option value="low">Low - General Question</option>
                                        <option value="medium">Medium - Minor Issue</option>
                                        <option value="high">High - Critical Issue</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" className="btn-primary flex-1 justify-center">Submit Ticket</button>
                                    <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Detail View */}
                <AnimatePresence>
                    {selectedTicket && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex-1 md:flex-[2] bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden absolute md:relative inset-0 z-10 md:z-auto"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                        {selectedTicket.subject}
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedTicket.status]}`}>{selectedTicket.status.replace('_', ' ')}</span>
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-1">Ticket ID: #{selectedTicket.id} • {new Date(selectedTicket.created_at).toLocaleDateString()}</p>
                                </div>
                                <button onClick={() => setSelectedTicket(null)} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                    <HiOutlineX className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                                {/* Original Ticket */}
                                <div className="flex gap-3 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold shrink-0">
                                        You
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl rounded-tr-none shadow-sm border border-gray-100 max-w-[85%]">
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                                        <div className="text-[10px] text-gray-400 mt-2 text-right">{new Date(selectedTicket.created_at).toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* Replies */}
                                {selectedTicket.replies?.map(r => (
                                    <div key={r.id} className={`flex gap-3 ${r.user_role === 'client' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${r.user_role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-violet-100 text-violet-600'}`}>
                                            {r.user_role === 'admin' ? 'A' : 'You'}
                                        </div>
                                        <div className={`p-3 rounded-2xl shadow-sm border max-w-[85%] ${r.user_role === 'admin' ? 'bg-indigo-600 text-white rounded-tl-none border-indigo-600' : 'bg-white text-gray-700 rounded-tr-none border-gray-100'}`}>
                                            <div className={`text-xs font-bold mb-1 ${r.user_role === 'admin' ? 'text-indigo-100' : 'text-gray-900'}`}>{r.user_role === 'admin' ? 'Support Team' : 'You'}</div>
                                            <p className="text-sm whitespace-pre-wrap">{r.message}</p>
                                            <div className={`text-[10px] mt-2 text-right ${r.user_role === 'admin' ? 'text-indigo-200' : 'text-gray-400'}`}>{new Date(r.created_at).toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Input */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <form onSubmit={sendReply} className="flex gap-2">
                                    <input
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                        placeholder="Type a reply..."
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!reply.trim() || sending}
                                        className="btn-primary !py-2.5 !px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <HiOutlinePaperAirplane className="w-5 h-5 transform rotate-90" />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
