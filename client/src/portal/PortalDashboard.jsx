import { motion } from 'framer-motion'
import { HiOutlineFolder, HiOutlineDocumentText, HiOutlineClock, HiOutlineCheckCircle } from 'react-icons/hi'
import { useState, useEffect } from 'react'
import api from '../lib/api'

export default function PortalDashboard() {
    const [stats, setStats] = useState({ active_projects: 0, pending_invoices: 0, completed_projects: 0, in_progress: 0 })
    const [recentActivity, setRecentActivity] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data } = await api.get('/client/dashboard')
                setStats(data.stats)
                setRecentActivity(data.recent_activity)
            } catch (error) {
                console.error('Failed to fetch stats', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboard()
    }, [])

    const statCards = [
        { label: 'Active Projects', value: stats.active_projects, icon: HiOutlineFolder, bg: 'bg-blue-50', color: 'text-blue-600' },
        { label: 'Pending Invoices', value: stats.pending_invoices, icon: HiOutlineDocumentText, bg: 'bg-amber-50', color: 'text-amber-600' },
        { label: 'In Progress', value: stats.in_progress, icon: HiOutlineClock, bg: 'bg-purple-50', color: 'text-purple-600' },
        { label: 'Completed', value: stats.completed_projects, icon: HiOutlineCheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    ]

    if (loading) return <div className="text-center py-12 text-gray-500">Loading dashboard...</div>

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-5 border border-gray-100">
                        <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                            <s.icon className={`w-5 h-5 ${s.color}`} />
                        </div>
                        <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                        <div className="text-sm text-gray-500">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {recentActivity.length === 0 ? <p className="text-gray-500 text-sm">No recent activity.</p> : recentActivity.map((a, i) => (
                        <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                            <div className={`w-2 h-2 rounded-full ${a.type === 'invoice' ? 'bg-amber-400' : a.type === 'project' ? 'bg-blue-400' : 'bg-green-400'}`} />
                            <div className="flex-1">
                                <p className="text-sm text-gray-900">{a.text}</p>
                                <p className="text-xs text-gray-500">{a.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
