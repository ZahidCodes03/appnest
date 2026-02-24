import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlinePencil, HiOutlineCheck, HiOutlineTrash } from 'react-icons/hi'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Pricing() {
    const [packages, setPackages] = useState([])
    const [editing, setEditing] = useState(null)
    const [adding, setAdding] = useState(false)
    const [form, setForm] = useState({ name: '', price: '', type: '', features: '', featured: false })
    const [loading, setLoading] = useState(true)

    const fetchPricing = async () => {
        try {
            const { data } = await api.get('/pricing')
            setPackages(data)
        } catch (error) {
            toast.error('Failed to fetch pricing')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPricing()
    }, [])

    const startAdd = () => {
        setAdding(true)
        setEditing(null)
        setForm({ name: '', price: '₹', type: 'One Time', features: '', featured: false })
    }

    const saveAdd = async () => {
        try {
            const updatedFeatures = form.features.split('\n').filter(Boolean)
            const { data } = await api.post('/pricing', { ...form, features: updatedFeatures })
            setPackages([...packages, data])
            setAdding(false)
            toast.success('Package added')
        } catch (error) {
            toast.error('Failed to add package')
        }
    }

    const startEdit = (pkg) => {
        setAdding(false)
        setEditing(pkg.id)
        setForm({ ...pkg, features: Array.isArray(pkg.features) ? pkg.features.join('\n') : pkg.features || '' })
    }

    const saveEdit = async () => {
        try {
            const updatedFeatures = form.features.split('\n').filter(Boolean)
            const { data } = await api.put(`/pricing/${editing}`, { ...form, features: updatedFeatures })
            setPackages(packages.map((p) => p.id === editing ? data : p))
            setEditing(null)
            toast.success('Package updated')
        } catch (error) {
            toast.error('Failed to update package')
        }
    }

    const deletePackage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this package?')) return
        try {
            await api.delete(`/pricing/${id}`)
            setPackages(packages.filter((p) => p.id !== id))
            toast.success('Package deleted')
        } catch (error) {
            toast.error('Failed to delete package')
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading pricing packages...</div>

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">Edit your pricing packages below. Changes will be reflected on the website.</p>
                <button onClick={startAdd} className="btn-primary text-sm !py-2">Add New Package</button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {adding && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-blue-50 rounded-2xl border border-blue-200 p-6 shadow-lg">
                        <div className="space-y-3">
                            <h3 className="font-bold text-blue-900 mb-2">New Package</h3>
                            <input placeholder="Package Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold" />
                            <input placeholder="Price (e.g. ₹15,000)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                            <input placeholder="Type (e.g. One Time)" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                            <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm resize-none" rows={5} placeholder="Features (one per line)" />
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured Package
                            </label>
                            <div className="flex gap-2">
                                <button onClick={saveAdd} className="btn-primary text-sm !py-2 flex-1 justify-center">Create</button>
                                <button onClick={() => setAdding(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                            </div>
                        </div>
                    </motion.div>
                )}
                {packages.map((pkg, i) => (
                    <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`bg-white rounded-2xl border p-6 ${pkg.featured ? 'border-blue-300 shadow-lg' : 'border-gray-100'}`}>
                        {editing === pkg.id ? (
                            <div className="space-y-3">
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold" />
                                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                                <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                                <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm resize-none" rows={7} placeholder="One feature per line" />
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured Package
                                </label>
                                <button onClick={saveEdit} className="btn-primary text-sm !py-2 w-full justify-center"><HiOutlineCheck className="w-4 h-4" /> Save</button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => startEdit(pkg)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><HiOutlinePencil className="w-4 h-4" /></button>
                                        <button onClick={() => deletePackage(pkg.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><HiOutlineTrash className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="text-3xl font-extrabold gradient-text mb-1">{pkg.price}</div>
                                <div className="text-gray-500 text-sm mb-4">{pkg.type}</div>
                                <ul className="space-y-2">
                                    {(Array.isArray(pkg.features) ? pkg.features : []).map((f) => (
                                        <li key={f} className="flex items-start gap-2 text-gray-600 text-sm">
                                            <HiOutlineCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> {f}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
