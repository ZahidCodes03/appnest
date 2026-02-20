
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineSearch, HiOutlineFilter, HiOutlineChatAlt2, HiOutlineX, HiOutlineTrash } from 'react-icons/hi'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function AdminTickets() {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [reply, setReply] = useState('')
    const [sending, setSending] = useState(false)
    const { user } = useAuth()

    const fetchTickets = async () => {
        try {
            const { data } = await api.get('/tickets')
            setTickets(data)
        } catch (error) {
            toast.error('Failed to fetch tickets')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const openTicket = async (ticket) => {
        try {
            const { data } = await api.get(`/tickets/${ticket.id}`)
            setSelectedTicket(data)
        } catch (error) {
            toast.error('Failed to load ticket details')
        }
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
        } catch (error) {
            toast.error('Failed to send reply')
        } finally {
            setSending(false)
        }
    }

    const updateStatus = async (status) => {
        try {
            const { data } = await api.put(`/tickets/${selectedTicket.id}`, { status })
            setSelectedTicket(prev => ({ ...prev, status: data.status }))
            setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: data.status } : t))
            toast.success(`Ticket marked as ${status}`)
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const statusColors = { open: 'bg-blue-100 text-blue-700', in_progress: 'bg-amber-100 text-amber-700', resolved: 'bg-green-100 text-green-700' }
    const priorityColors = { low: 'text-gray-500', medium: 'text-amber-600', high: 'text-red-600' }

    if (loading) return <div className="text-center p-8 text-gray-500">Loading tickets...</div>

    return (
        <div className="space-y-4 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
                <span className="text-gray-500 text-sm">{tickets.length} tickets</span>
            </div>

            <div className="flex-1 overflow-hidden flex gap-6">
                {/* Tickets List */}
                <div className={`flex-1 bg-white rounded-2xl border border-gray-100 overflow-y-auto ${selectedTicket ? 'hidden md:block md:w-1/3 md:flex-none' : 'w-full'}`}>
                    {tickets.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No tickets found</div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {tickets.map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => openTicket(t)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedTicket?.id === t.id ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-medium text-sm ${selectedTicket?.id === t.id ? 'text-blue-900' : 'text-gray-900'}`}>{t.subject}</h3>
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

                {/* Chat / Detail View */}
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
                                    <p className="text-xs text-gray-500 mt-1">Client: {selectedTicket.client_name} • Priority: {selectedTicket.priority}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={selectedTicket.status}
                                        onChange={(e) => updateStatus(e.target.value)}
                                        className="text-xs border-gray-200 rounded-lg py-1.5 px-3 bg-white"
                                    >
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to delete this ticket?')) {
                                                try {
                                                    await api.delete(`/tickets/${selectedTicket.id}`)
                                                    setTickets(tickets.filter(t => t.id !== selectedTicket.id))
                                                    setSelectedTicket(null)
                                                    toast.success('Ticket deleted')
                                                } catch (err) {
                                                    toast.error('Failed to delete ticket')
                                                }
                                            }
                                        }}
                                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                                        title="Delete Ticket"
                                    >
                                        <HiOutlineTrash className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setSelectedTicket(null)} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                        <HiOutlineX className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                                {/* Original Ticket Description */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                        {selectedTicket.client_name?.[0]}
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[85%]">
                                        <div className="text-xs font-bold text-gray-900 mb-1">{selectedTicket.client_name} <span className="text-gray-400 font-normal ml-2">Ticket Description</span></div>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                                        <div className="text-[10px] text-gray-400 mt-2 text-right">{new Date(selectedTicket.created_at).toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* Replies */}
                                {selectedTicket.replies?.map(r => (
                                    <div key={r.id} className={`flex gap-3 ${r.user_role === 'admin' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${r.user_role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                            {r.user_name?.[0]}
                                        </div>
                                        <div className={`p-3 rounded-2xl shadow-sm border max-w-[85%] ${r.user_role === 'admin' ? 'bg-indigo-600 text-white rounded-tr-none border-indigo-600' : 'bg-white text-gray-700 rounded-tl-none border-gray-100'}`}>
                                            <div className={`text-xs font-bold mb-1 ${r.user_role === 'admin' ? 'text-indigo-100' : 'text-gray-900'}`}>{r.user_name}</div>
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
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!reply.trim() || sending}
                                        className="btn-primary !py-2.5 !px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <HiOutlineChatAlt2 className="w-5 h-5" />
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
