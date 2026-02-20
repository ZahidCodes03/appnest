import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa'
import { HiArrowLeft } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const user = await login(email.trim(), password)
            toast.success(`Welcome back, ${user.name}!`)
            navigate(user.role === 'admin' ? '/admin' : '/portal')
        } catch (err) {
            toast.error(err.response?.data?.error || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-20 relative">
            <Link
                to="/"
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:text-blue-600 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
            >
                <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Website
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <img src="/logo.png" alt="AppNest" className="h-24 w-auto mx-auto mb-4 object-contain" />
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-600 mt-1">Sign in to your account</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm"
                                    placeholder="admin@appnest.in"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base !py-3.5">
                            {loading ? 'Signing in...' : 'Sign In'} {!loading && <FaArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                    {/* <p className="text-center text-gray-500 text-sm mt-6">
                        Default admin: admin@appnest.in / Admin@123
                    </p> */}
                </div>
            </motion.div>
        </div>
    )
}
