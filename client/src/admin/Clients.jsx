import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlinePlus, HiOutlineTrash, HiOutlineMail, HiOutlinePencil } from 'react-icons/hi'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Clients() {
    const [clients, setClients] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editClient, setEditClient] = useState(null)
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        try {
            const { data } = await api.get('/clients')
            setClients(data)
        } catch (err) {
            toast.error('Failed to load clients')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (editClient) {
                const { data } = await api.put(`/clients/${editClient.id}`, form)
                setClients(clients.map(c => c.id === editClient.id ? data : c))
                toast.success('Client updated successfully')
            } else {
                const { data } = await api.post('/clients', form)
                setClients([data, ...clients])
                toast.success('Client added successfully')
            }
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to save client')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this client? This may fail if they have associated projects, invoices, or tickets.')) return
        try {
            await api.delete(`/clients/${id}`)
            setClients(clients.filter(c => c.id !== id))
            toast.success('Client deleted')
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete client')
        }
    }

    const resetForm = () => {
        setForm({ name: '', email: '', phone: '', password: '' })
        setShowForm(false)
        setEditClient(null)
    }

    const startEdit = (client) => {
        setEditClient(client)
        setForm({ name: client.name, email: client.email, phone: client.phone || '', password: '' })
        setShowForm(true)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm">{clients.length} clients</p>
                <button
                    onClick={() => {
                        if (showForm && !editClient) resetForm()
                        else {
                            resetForm()
                            setShowForm(true)
                        }
                    }}
                    className="btn-primary text-sm !py-2 !px-4"
                >
                    <HiOutlinePlus className="w-4 h-4" /> Add Client
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl border border-gray-100 p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden"
                    >
                        <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-900">{editClient ? 'Edit Client' : 'Add New Client'}</h3>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 ml-1">Name</label>
                            <input required placeholder="Client name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 ml-1">Email</label>
                            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 ml-1">Password {editClient && '(Leave blank to keep same)'}</label>
                            <input required={!editClient} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 ml-1">Phone</label>
                            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                        </div>
                        <div className="flex gap-2 sm:col-span-2 lg:col-span-4 justify-end mt-2">
                            <button type="button" onClick={resetForm} className="btn-secondary text-sm !py-2">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-primary text-sm !py-2">{loading ? 'Saving...' : (editClient ? 'Update Client' : 'Save Client')}</button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-5 py-3 font-semibold text-gray-700">Client</th>
                                <th className="px-5 py-3 font-semibold text-gray-700 hidden md:table-cell">Phone</th>
                                <th className="px-5 py-3 font-semibold text-gray-700">Projects</th>
                                <th className="px-5 py-3 font-semibold text-gray-700">Joined</th>
                                <th className="px-5 py-3 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.length === 0 ? (
                                <tr><td colSpan="5" className="px-5 py-8 text-center text-gray-500">No clients found</td></tr>
                            ) : (
                                clients.map((c, i) => (
                                    <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-t border-gray-50 hover:bg-gray-50/50">
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-900">{c.name}</div>
                                            <div className="text-gray-500 text-xs">{c.email}</div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 hidden md:table-cell">{c.phone || '-'}</td>
                                        <td className="px-5 py-4 text-gray-600">{c.projects || 0}</td>
                                        <td className="px-5 py-4 text-gray-600">{new Date(c.created_at).toLocaleDateString()}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Edit Client"><HiOutlinePencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete Client"><HiOutlineTrash className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

