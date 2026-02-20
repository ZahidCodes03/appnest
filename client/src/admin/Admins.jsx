import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Admins() {
    const [admins, setAdmins] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editAdmin, setEditAdmin] = useState(null)
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchAdmins()
    }, [])

    const fetchAdmins = async () => {
        try {
            const { data } = await api.get('/admins')
            setAdmins(data)
        } catch (err) {
            toast.error('Failed to load admins')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (editAdmin) {
                const { data } = await api.put(`/admins/${editAdmin.id}`, form)
                setAdmins(admins.map(a => a.id === editAdmin.id ? data : a))
                toast.success('Admin updated successfully')
            } else {
                const { data } = await api.post('/admins', form)
                setAdmins([data, ...admins])
                toast.success('Admin added successfully')
            }
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to save admin')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this admin?')) return
        try {
            await api.delete(`/admins/${id}`)
            setAdmins(admins.filter(a => a.id !== id))
            toast.success('Admin deleted')
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete admin')
        }
    }

    const resetForm = () => {
        setForm({ name: '', email: '', phone: '', password: '' })
        setShowForm(false)
        setEditAdmin(null)
    }

    const startEdit = (admin) => {
        setEditAdmin(admin)
        setForm({ name: admin.name, email: admin.email, phone: admin.phone || '', password: '' })
        setShowForm(true)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm">{admins.length} admins</p>
                <button
                    onClick={() => {
                        if (showForm && !editAdmin) resetForm()
                        else {
                            resetForm()
                            setShowForm(true)
                        }
                    }}
                    className="btn-primary text-sm !py-2 !px-4"
                >
                    <HiOutlinePlus className="w-4 h-4" /> Add Admin
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
                            <h3 className="font-bold text-gray-900">{editAdmin ? 'Edit Admin' : 'Add New Admin'}</h3>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 ml-1">Name</label>
                            <input required placeholder="Admin name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 ml-1">Email</label>
                            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 ml-1">Password {editAdmin && '(Leave blank to keep same)'}</label>
                            <input required={!editAdmin} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 ml-1">Phone</label>
                            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                        </div>
                        <div className="flex gap-2 sm:col-span-2 lg:col-span-4 justify-end mt-2">
                            <button type="button" onClick={resetForm} className="btn-secondary text-sm !py-2">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-primary text-sm !py-2">{loading ? 'Saving...' : (editAdmin ? 'Update Admin' : 'Save Admin')}</button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-5 py-3 font-semibold text-gray-700">Admin</th>
                                <th className="px-5 py-3 font-semibold text-gray-700 hidden md:table-cell">Phone</th>
                                <th className="px-5 py-3 font-semibold text-gray-700">Joined</th>
                                <th className="px-5 py-3 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.length === 0 ? (
                                <tr><td colSpan="4" className="px-5 py-8 text-center text-gray-500">No admins found</td></tr>
                            ) : (
                                admins.map((a, i) => (
                                    <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-t border-gray-50 hover:bg-gray-50/50">
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-900">{a.name}</div>
                                            <div className="text-gray-500 text-xs">{a.email}</div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 hidden md:table-cell">{a.phone || '-'}</td>
                                        <td className="px-5 py-4 text-gray-600">{new Date(a.created_at).toLocaleDateString()}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => startEdit(a)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Edit Admin"><HiOutlinePencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete Admin"><HiOutlineTrash className="w-4 h-4" /></button>
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
