import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineBell, HiOutlineCheck, HiOutlineX } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications')
            setNotifications(data)
            setUnreadCount(data.filter(n => !n.read).length)
        } catch (err) {
            console.error('Failed to fetch notifications', err)
        }
    }

    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000) // Poll every 30s
        return () => clearInterval(interval)
    }, [])

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`)
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (err) {
            console.error('Failed to mark as read', err)
        }
    }

    const handleClearAll = async () => {
        try {
            await api.delete('/notifications/clear')
            setNotifications([])
            setUnreadCount(0)
        } catch (err) {
            console.error('Failed to clear notifications', err)
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors relative"
            >
                <HiOutlineBell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="font-bold text-gray-900">Notifications</h3>
                                <button onClick={() => setIsOpen(false)}><HiOutlineX className="w-4 h-4 text-gray-400" /></button>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 text-sm">No notifications yet</div>
                                ) : (
                                    notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors relative ${!n.read ? 'bg-blue-50/30' : ''}`}
                                            onClick={() => !n.read && markAsRead(n.id)}
                                        >
                                            <div className="flex gap-3 text-left">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.type === 'payment' ? 'bg-amber-100 text-amber-600' :
                                                    n.type === 'success' ? 'bg-green-100 text-green-600' :
                                                        n.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    <HiOutlineBell className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-gray-900">{n.title}</div>
                                                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                                                    {n.link && (
                                                        <Link
                                                            to={n.link}
                                                            className="text-[10px] text-blue-600 font-bold mt-1 inline-block hover:underline"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsOpen(false);
                                                                if (!n.read) markAsRead(n.id);
                                                            }}
                                                        >
                                                            View Details
                                                        </Link>
                                                    )}
                                                    <div className="text-[10px] text-gray-400 mt-1">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                                {!n.read && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {notifications.length > 0 && (
                                <div className="p-3 bg-gray-50 text-center">
                                    <button
                                        onClick={handleClearAll}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
