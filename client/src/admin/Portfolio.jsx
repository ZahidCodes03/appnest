import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { HiPlus, HiTrash, HiUpload } from 'react-icons/hi'
import api from '../lib/api'
import toast from 'react-hot-toast'

export default function Portfolio() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ title: '', tech: '', category: '', description: '', screenshot_url: '', demo_url: '' })
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchPortfolio()
    }, [])

    const fetchPortfolio = async () => {
        try {
            const { data } = await api.get('/portfolio')
            setItems(data)
        } catch (error) {
            console.error('Failed to fetch portfolio', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)
        setUploading(true)

        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setForm({ ...form, screenshot_url: data.url })
            toast.success('Image uploaded successfully')
        } catch (error) {
            toast.error('Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post('/portfolio', form)
            toast.success('Project added successfully')
            setShowForm(false)
            setForm({ title: '', tech: '', category: '', description: '', screenshot_url: '', demo_url: '' })
            fetchPortfolio()
        } catch (error) {
            toast.error('Failed to add project')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return
        try {
            await api.delete(`/portfolio/${id}`)
            toast.success('Project deleted')
            fetchPortfolio()
        } catch (error) {
            toast.error('Failed to delete project')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
                <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                    <HiPlus className="w-5 h-5" /> Add Project
                </button>
            </div>

            {showForm && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Project</h3>
                    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                        <input required placeholder="Project Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                        <input required placeholder="Technologies (e.g., React, Node.js)" value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                        <input required placeholder="Category (e.g., Web App)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                        <input placeholder="Demo URL (optional)" value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project Screenshot</label>
                            <div className="flex gap-4 items-center">
                                <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 text-sm font-medium">
                                    <HiUpload className="w-5 h-5 text-gray-500" />
                                    Choose File
                                    <input type="file" onChange={handleUpload} className="hidden" accept="image/*" />
                                </label>
                                {uploading && <span className="text-sm text-blue-600 animate-pulse font-medium">Uploading...</span>}
                                {form.screenshot_url && <span className="text-sm text-green-600 font-medium">Image Uploaded!</span>}
                            </div>
                            {form.screenshot_url && <img src={form.screenshot_url} alt="Preview" className="mt-3 h-32 w-auto rounded-lg border border-gray-200 object-cover" />}
                        </div>

                        <textarea required placeholder="Project Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm sm:col-span-2 resize-none" />

                        <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                            <button type="submit" disabled={uploading} className="btn-primary">Save Project</button>
                        </div>
                    </form>
                </motion.div>
            )}

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading projects...</div>
            ) : items.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl">No projects found. Add one to get started!</div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all">
                            <div className="h-48 bg-gray-100 relative">
                                {item.screenshot_url ? (
                                    <img src={item.screenshot_url} alt={item.title} className="w-full h-full object-contain bg-gray-50" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"><HiTrash /></button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900">{item.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
