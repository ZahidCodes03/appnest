import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa'
import api from '../lib/api'

export default function BlogDetail() {
    const { slug } = useParams()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await api.get(`/blogs/${slug}`)
                setBlog(data)
            } catch (error) {
                console.error('Failed to fetch blog', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBlog()
        window.scrollTo(0, 0)
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="animate-pulse text-blue-600 font-medium text-lg">Loading amazing insights...</div>
            </div>
        )
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h2>
                <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
                <Link to="/" className="btn-primary">Back to Home</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <header className="bg-gray-50 pt-32 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-violet-600 font-bold text-sm hover:gap-3 transition-all mb-4"
                        >
                            <FaArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-500" />
                                {new Date(blog.created_at || blog.date).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center gap-2">
                                <FaUser className="text-violet-500" />
                                Admin
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClock className="text-violet-500" />
                                <span>{blog.reading_time || '5 min'} read</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Post Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-lg max-w-none prose-blue"
                >
                    <div className="text-gray-700 leading-relaxed space-y-6 whitespace-pre-wrap">
                        {blog.content}
                    </div>
                </motion.div>

                {/* Footer / Call to Action */}
                <div className="mt-16 pt-16 border-t border-gray-100">
                    <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-white text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Have a project in mind?</h3>
                        <p className="text-white/80 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
                            Let's build something amazing together. Our expert team is ready to transform your ideas into reality.
                        </p>
                        <Link to="/#contact" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold hover:shadow-xl transition-all">
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
