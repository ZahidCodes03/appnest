import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'

const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Services', href: '/#services' },
    { name: 'Portfolio', href: '/#portfolio' },
    { name: 'About', href: '/#about' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/#contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMobileOpen(false)
    }, [location])

    const handleNavClick = (href) => {
        setMobileOpen(false)

        if (href.startsWith('/#')) {
            if (location.pathname !== '/') {
                navigate(href)
                return
            }
            const id = href.replace('/#', '')
            const el = document.getElementById(id)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' })
            }
            return
        }

        navigate(href)
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-violet-500/5'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-24">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 h-full py-2">
                        <img src="/logo.png" alt="AppNest" className="h-full w-auto object-contain" />
                        <div className="block ml-2">
                            <span className="font-bold text-base sm:text-xl text-gray-900 leading-tight">AppNest Technologies</span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleNavClick(link.href)
                                }}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-violet-50 transition-all duration-200"
                            >
                                {link.name}
                            </a>
                        ))}
                        <Link
                            to="/login"
                            className="ml-2 btn-primary text-sm !py-2.5 !px-6"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                        {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleNavClick(link.href)
                                    }}
                                    className="block px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-violet-50 font-medium"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <Link
                                to="/login"
                                className="block text-center btn-primary mt-3"
                            >
                                Login
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
