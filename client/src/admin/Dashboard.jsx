import { motion } from 'framer-motion'
import { HiOutlineInbox, HiOutlineFolder, HiOutlineUsers, HiOutlineCurrencyRupee, HiOutlineCheckCircle } from 'react-icons/hi'
import { useState, useEffect } from 'react'
import api from '../lib/api'

export default function Dashboard() {
    const [stats, setStats] = useState({ inquiries: 0, active_projects: 0, total_clients: 0, revenue: 0, pending_approvals: 0 })
    const [recentInquiries, setRecentInquiries] = useState([])
    const [recentProjects, setRecentProjects] = useState([])
    const [recentTickets, setRecentTickets] = useState([])
    const [recentMessages, setRecentMessages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data } = await api.get('/admin/dashboard')
                setStats(data.stats)
                setRecentInquiries(data.recent_inquiries)
                setRecentProjects(data.recent_projects)
                setRecentTickets(data.recent_tickets)
                setRecentMessages(data.recent_messages)
            } catch (error) {
                console.error('Failed to fetch dashboard', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboard()
    }, [])

    const statCards = [
        { label: 'Total Inquiries', value: stats.inquiries, icon: HiOutlineInbox, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Projects', value: stats.active_projects, icon: HiOutlineFolder, color: 'from-cyan-500 to-teal-500', bg: 'bg-cyan-50' },
        { label: 'Total Clients', value: stats.total_clients, icon: HiOutlineUsers, color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50' },
        { label: 'Pending Approvals', value: stats.pending_approvals, icon: HiOutlineCheckCircle, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
        { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: HiOutlineCurrencyRupee, color: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50' },
    ]

    if (loading) return <div className="text-center py-20 text-gray-500">Loading dashboard...</div>

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                                <s.icon className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Inquiries */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Inquiries</h2>
                    <div className="space-y-3">
                        {recentInquiries.length === 0 ? <p className="text-gray-500 text-sm">No recent inquiries.</p> : recentInquiries.map((inq) => (
                            <div key={inq.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                <div>
                                    <div className="font-medium text-gray-900 text-sm">{inq.name}</div>
                                    <div className="text-gray-500 text-xs">{inq.project_type} • {new Date(inq.created_at).toLocaleDateString()}</div>
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">New</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Projects */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Active Projects</h2>
                    <div className="space-y-4">
                        {recentProjects.length === 0 ? <p className="text-gray-500 text-sm">No active projects.</p> : recentProjects.map((proj) => (
                            <div key={proj.id} className="py-3 border-b border-gray-50 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <div className="font-medium text-gray-900 text-sm">{proj.name}</div>
                                        <div className="text-gray-500 text-xs">{proj.client_name || 'Unknown Client'}</div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${proj.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {proj.status}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all" style={{ width: `${proj.progress || 0}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Support Tickets */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Tickets</h2>
                    <div className="space-y-3">
                        {recentTickets.length === 0 ? <p className="text-gray-500 text-sm">No recent tickets.</p> : recentTickets.map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                <div>
                                    <div className="font-medium text-gray-900 text-sm">{ticket.subject}</div>
                                    <div className="text-gray-500 text-xs">{ticket.client_name} • {ticket.priority}</div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ticket.status === 'open' ? 'bg-blue-100 text-blue-700' : ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {ticket.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Messages */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Messages</h2>
                    <div className="space-y-3">
                        {recentMessages.length === 0 ? <p className="text-gray-500 text-sm">No recent messages.</p> : recentMessages.map((msg) => (
                            <div key={msg.id} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                                    {msg.sender_name?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 text-sm">{msg.sender_name}</div>
                                    <p className="text-gray-600 text-sm line-clamp-2">{msg.text}</p>
                                    <div className="text-gray-400 text-xs mt-1">{new Date(msg.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
