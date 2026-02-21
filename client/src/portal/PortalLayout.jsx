import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
    HiOutlineHome, HiOutlineFolder, HiOutlineDocumentText,
    HiOutlineDownload, HiOutlineTicket, HiOutlineChatAlt2,
    HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineExternalLink
} from 'react-icons/hi'
import NotificationDropdown from '../components/NotificationDropdown'

const sidebarLinks = [
    { name: 'Dashboard', path: '/portal', icon: HiOutlineHome },
    { name: 'My Projects', path: '/portal/projects', icon: HiOutlineFolder },
    { name: 'Invoices', path: '/portal/invoices', icon: HiOutlineDocumentText },
    { name: 'Deliverables', path: '/portal/deliverables', icon: HiOutlineDownload },
    { name: 'Support Tickets', path: '/portal/tickets', icon: HiOutlineTicket },
    { name: 'Messages', path: '/portal/messages', icon: HiOutlineChatAlt2 },
]

export default function PortalLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => { logout(); navigate('/login') }

    return (
        <div className="flex h-screen bg-gray-50">
            <aside className={`bg-white border-r border-gray-200 w-64 shrink-0 flex flex-col fixed inset-y-0 left-0 z-40 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-5 flex items-center gap-3 border-b border-gray-100">
                    <img src="/logo.png" alt="AppNest" className="h-12 w-auto object-contain" />
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-900 leading-tight">AppNest Technologies</span>
                        <span className="text-blue-600 font-bold text-xs">Client Portal</span>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {sidebarLinks.map((link) => {
                        const active = location.pathname === link.path
                        return (
                            <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-violet-50 text-violet-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                                <link.icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-sm font-bold text-violet-700">
                            {user?.name?.[0] || 'C'}
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">{user?.name || 'Client'}</div>
                            <div className="text-xs text-gray-500">{user?.email}</div>
                        </div>
                    </div>
                    <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm transition-colors mb-3">
                        <HiOutlineExternalLink className="w-4 h-4" /> Back to Website
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm transition-colors">
                        <HiOutlineLogout className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            <AnimatePresence>
                {sidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden" />}
            </AnimatePresence>

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
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
                            {user?.name?.[0] || 'C'}
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
