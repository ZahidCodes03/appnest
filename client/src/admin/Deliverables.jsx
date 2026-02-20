import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiTrash, HiUpload, HiOutlineDocument, HiOutlineDownload } from 'react-icons/hi'
import api from '../lib/api'
import toast from 'react-hot-toast'

export default function Deliverables() {
    const [deliverables, setDeliverables] = useState([])
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ project_id: '', title: '', file_url: '' })
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [delivRes, projRes] = await Promise.all([
                api.get('/deliverables'),
                api.get('/projects')
            ])
            setDeliverables(delivRes.data)
            setProjects(projRes.data)
        } catch (error) {
            console.error('Failed to fetch data', error)
            toast.error('Failed to load deliverables')
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
            setForm({ ...form, file_url: data.url })
            toast.success('File uploaded successfully')
        } catch (error) {
            toast.error('Failed to upload file')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.file_url) return toast.error('Please upload a file first')
        try {
            await api.post('/deliverables', form)
            toast.success('Deliverable added successfully')
            setShowForm(false)
            setForm({ project_id: '', title: '', file_url: '' })
            fetchData()
        } catch (error) {
            toast.error('Failed to add deliverable')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this deliverable?')) return
        try {
            await api.delete(`/deliverables/${id}`)
            toast.success('Deliverable deleted')
            fetchData()
        } catch (error) {
            toast.error('Failed to delete deliverable')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Manage Deliverables</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
                    {showForm ? 'Cancel' : <><HiPlus className="w-5 h-5" /> Add Deliverable</>}
                </button>
            </div>

            {showForm && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Upload New Deliverable</h3>
                    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Project</label>
                            <select
                                required
                                value={form.project_id}
                                onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                            >
                                <option value="">Select Project</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name} ({p.client_name})</option>)}
                            </select>
                        </div>
                        <div className="sm:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deliverable Title</label>
                            <input
                                required
                                placeholder="e.g., Final Design Assets, APK v1.0"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                            <div className="flex gap-4 items-center">
                                <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 text-sm font-medium">
                                    <HiUpload className="w-5 h-5 text-gray-500" />
                                    Choose File
                                    <input type="file" onChange={handleUpload} className="hidden" />
                                </label>
                                {uploading && <span className="text-sm text-blue-600 animate-pulse font-medium">Uploading...</span>}
                                {form.file_url && <span className="text-sm text-green-600 font-medium">File Uploaded!</span>}
                            </div>
                        </div>

                        <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                            <button type="submit" disabled={uploading} className="btn-primary">Save & Deliver</button>
                        </div>
                    </form>
                </motion.div>
            )}

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading deliverables...</div>
            ) : deliverables.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">No deliverables found. Upload files to deliver the project.</div>
            ) : (
                <div className="grid gap-4">
                    {deliverables.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4 text-left">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <HiOutlineDocument className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="text-left flex-1">
                                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                                    <p className="text-xs text-gray-500">{item.project_name} • {new Date(item.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={item.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                    title="Download"
                                >
                                    <HiOutlineDownload className="w-5 h-5" />
                                </a>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                    title="Delete"
                                >
                                    <HiTrash className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
