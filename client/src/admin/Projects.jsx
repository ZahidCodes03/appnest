import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Projects() {
    const [projects, setProjects] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({ name: '', client_id: '', status: 'planning', progress: 0, deadline: '', description: '' })
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects')
            setProjects(data)
        } catch (error) { toast.error('Failed to fetch projects') }
        finally { setLoading(false) }
    }

    const fetchClients = async () => {
        try {
            const { data } = await api.get('/clients')
            setClients(data)
        } catch (error) { console.error('Failed to fetch clients', error) }
    }

    useEffect(() => {
        fetchProjects()
        fetchClients()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingId) {
                const { data } = await api.put(`/projects/${editingId}`, form)
                setProjects(projects.map(p => p.id === editingId ? { ...p, ...data, client_name: clients.find(c => c.id == data.client_id)?.name } : p))
                toast.success('Project updated')
            } else {
                const { data } = await api.post('/projects', form)
                setProjects([{ ...data, client_name: clients.find(c => c.id == data.client_id)?.name }, ...projects])
                toast.success('Project added')
            }
            setForm({ name: '', client_id: '', status: 'planning', progress: 0, deadline: '', description: '' })
            setShowForm(false)
            setEditingId(null)
        } catch (error) { toast.error('Failed to save project') }
    }

    const handleEdit = (p) => {
        setForm({
            name: p.name,
            client_id: p.client_id,
            status: p.status,
            progress: p.progress,
            deadline: p.deadline ? p.deadline.split('T')[0] : '',
            description: p.description || ''
        })
        setEditingId(p.id)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return
        try {
            await api.delete(`/projects/${id}`)
            setProjects(projects.filter((p) => p.id !== id))
            toast.success('Project deleted')
        } catch (error) { toast.error('Failed to delete project') }
    }

    const statusColors = { planning: 'bg-purple-100 text-purple-700', in_progress: 'bg-amber-100 text-amber-700', completed: 'bg-green-100 text-green-700', on_hold: 'bg-red-100 text-red-700' }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm">{projects.length} projects</p>
                <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', client_id: '', status: 'planning', progress: 0, deadline: '', description: '' }) }} className="btn-primary text-sm !py-2 !px-4"><HiOutlinePlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Project'}</button>
            </div>

            {showForm && (
                <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 grid sm:grid-cols-2 gap-4">
                    <input required placeholder="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                    <select required value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm">
                        <option value="">Select Client</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm">
                        <option value="planning">Planning</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                    </select>
                    <input type="number" min="0" max="100" placeholder="Progress %" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                    <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                    <input placeholder="Description (Optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm sm:col-span-2" />

                    <div className="flex gap-2 sm:col-span-2">
                        <button type="submit" className="btn-primary text-sm !py-2">{editingId ? 'Update Project' : 'Create Project'}</button>
                        <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} className="btn-secondary text-sm !py-2">Cancel</button>
                    </div>
                </motion.form>
            )}

            {loading ? (
                <div className="p-8 text-center text-gray-500">Loading projects...</div>
            ) : projects.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">No projects found.</div>
            ) : (
                <div className="grid gap-4">
                    {projects.map((p, i) => (
                        <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900">{p.name}</h3>
                                    <p className="text-gray-500 text-sm">{p.client_name || 'Unknown Client'} • Due: {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'No date'}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[p.status] || 'bg-gray-100'}`}>
                                        {p.status?.replace('_', ' ') || 'Unknown'}
                                    </span>
                                    <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><HiOutlinePencil className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-gray-100 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full" style={{ width: `${p.progress}%` }} />
                                </div>
                                <span className="text-sm font-medium text-gray-600">{p.progress}%</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
