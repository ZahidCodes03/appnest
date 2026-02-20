import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlinePlus, HiOutlineTrash, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Blog() {
    const [posts, setPosts] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ title: '', excerpt: '', content: '', status: 'draft' })
    const [loading, setLoading] = useState(true)

    const fetchBlogs = async () => {
        try {
            const { data } = await api.get('/blogs/all')
            setPosts(data)
        } catch (error) {
            toast.error('Failed to fetch blogs')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    const handleAdd = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.post('/blogs', form)
            setPosts([data, ...posts])
            setForm({ title: '', excerpt: '', content: '', status: 'draft' })
            setShowForm(false)
            toast.success('Blog post created')
        } catch (error) {
            toast.error('Failed to create post')
        }
    }

    const togglePublish = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'published' ? 'draft' : 'published'
            // We need to fetch the current post details first or just send the status upgrade if endpoint supports PATCH.
            // The existing endpoint is PUT /blogs/:id which expects all fields.
            // Let's find the post locally first.
            const post = posts.find(p => p.id === id)
            if (!post) return
            const { data } = await api.put(`/blogs/${id}`, { ...post, status: newStatus })
            setPosts(posts.map((p) => p.id === id ? data : p))
            toast.success(`Post ${newStatus}`)
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this post?')) return
        try {
            await api.delete(`/blogs/${id}`)
            setPosts(posts.filter((p) => p.id !== id))
            toast.success('Deleted')
        } catch (error) {
            toast.error('Failed to delete post')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm">{posts.length} blog posts</p>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm !py-2 !px-4"><HiOutlinePlus className="w-4 h-4" /> New Post</button>
            </div>

            {showForm && (
                <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                    <input required placeholder="Post title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                    <textarea placeholder="Excerpt / short description" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm resize-none" rows={2} />
                    <textarea required placeholder="Full blog content..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm resize-none" rows={6} />
                    <div className="flex gap-2">
                        <button type="submit" className="btn-primary text-sm !py-2">Save Draft</button>
                        <button type="button" onClick={() => { setForm({ ...form, status: 'published' }); }} className="btn-secondary text-sm !py-2">Publish</button>
                        <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 text-sm px-4">Cancel</button>
                    </div>
                </motion.form>
            )}

            {loading ? (
                <div className="p-8 text-center text-gray-500">Loading blogs...</div>
            ) : posts.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">No blog posts yet.</div>
            ) : (
                <div className="space-y-3">
                    {posts.map((post, i) => (
                        <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">{post.title}</h3>
                                    <p className="text-gray-500 text-sm mt-1">{post.excerpt}</p>
                                    <p className="text-gray-400 text-xs mt-2">{new Date(post.created_at || post.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {post.status}
                                    </span>
                                    <button onClick={() => togglePublish(post.id, post.status)} className="p-1.5 rounded-lg hover:bg-gray-100">
                                        {post.status === 'published' ? <HiOutlineEyeOff className="w-4 h-4 text-gray-500" /> : <HiOutlineEye className="w-4 h-4 text-blue-600" />}
                                    </button>
                                    <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                                        <HiOutlineTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
