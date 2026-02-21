import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
    HiOutlineHome, HiOutlineInbox, HiOutlineFolder, HiOutlinePhotograph,
    HiOutlinePencilAlt, HiOutlineStar, HiOutlineCurrencyRupee, HiOutlineDocumentText,
    HiOutlineUsers, HiOutlineDownload, HiOutlineCog, HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineExternalLink,
    HiOutlineChatAlt2, HiOutlineBriefcase, HiOutlineClipboardList
} from 'react-icons/hi'
import NotificationDropdown from '../components/NotificationDropdown'

const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: HiOutlineHome },
    { name: 'Inquiries', path: '/admin/inquiries', icon: HiOutlineInbox },
    { name: 'Tickets', path: '/admin/tickets', icon: HiOutlineChatAlt2 },
    { name: 'Messages', path: '/admin/messages', icon: HiOutlineUsers }, // Using Users icon as placeholder or import Chat icon
    { name: 'Projects', path: '/admin/projects', icon: HiOutlineFolder },
    { name: 'Deliverables', path: '/admin/deliverables', icon: HiOutlineDownload },
    { name: 'Portfolio', path: '/admin/portfolio', icon: HiOutlinePhotograph },
    { name: 'Blog', path: '/admin/blog', icon: HiOutlinePencilAlt },
    { name: 'Testimonials', path: '/admin/testimonials', icon: HiOutlineStar },
    { name: 'Pricing', path: '/admin/pricing', icon: HiOutlineCurrencyRupee },
    { name: 'Invoices', path: '/admin/invoices', icon: HiOutlineDocumentText },
    { name: 'Clients', path: '/admin/clients', icon: HiOutlineUsers },
    { name: 'Admins', path: '/admin/admins', icon: HiOutlineUsers },
    { name: 'Jobs', path: '/admin/jobs', icon: HiOutlineBriefcase },
    { name: 'Applications', path: '/admin/applications', icon: HiOutlineClipboardList },
    { name: 'Proposal Leads', path: '/admin/leads', icon: HiOutlineDownload },
    { name: 'Settings', path: '/admin/settings', icon: HiOutlineCog },
]

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => { logout(); navigate('/login') }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`admin-sidebar text-white w-64 shrink-0 flex flex-col fixed inset-y-0 left-0 z-40 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-5 flex items-center gap-3 border-b border-white/10">
                    <img src="/logo.png" alt="AppNest" className="h-12 w-auto object-contain" />
                    <div>
                        <span className="font-bold text-sm">AppNest</span>
                        <span className="text-cyan-400 font-bold text-sm"> Admin</span>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {sidebarLinks.map((link) => {
                        const active = location.pathname === link.path
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <link.icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div>
                            <div className="text-sm font-medium">{user?.name || 'Admin'}</div>
                            <div className="text-xs text-gray-400">{user?.email || 'admin@appnest.in'}</div>
                        </div>
                    </div>
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 text-sm transition-colors mb-3">
                        <HiOutlineExternalLink className="w-4 h-4" />
                        Back to Website
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors">
                        <HiOutlineLogout className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                            <HiOutlineMenu className="w-6 h-6" />
                        </button>
                        <NotificationDropdown />
                        <h1 className="text-lg font-bold text-gray-900">
                            {sidebarLinks.find((l) => l.path === location.pathname)?.name || 'Dashboard'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {user?.name?.[0] || 'A'}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
