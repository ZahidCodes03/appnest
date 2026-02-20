import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlinePlus, HiOutlineTrash, HiOutlineDownload, HiOutlineEye, HiOutlinePencilAlt } from 'react-icons/hi'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Invoices() {
    const [invoices, setInvoices] = useState([])
    const [clients, setClients] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [selected, setSelected] = useState(null)
    const [form, setForm] = useState({ client_id: '', items: [{ description: '', quantity: 1, rate: 0 }], due_date: '', invoice_number: '' })
    const [loading, setLoading] = useState(true)

    const fetchInvoices = async () => {
        try {
            const { data } = await api.get('/invoices')
            setInvoices(data)
        } catch { toast.error('Failed to fetch invoices') }
        finally { setLoading(false) }
    }

    const fetchClients = async () => {
        try {
            const { data } = await api.get('/clients')
            setClients(data)
        } catch { console.error('Failed to fetch clients') }
    }

    useEffect(() => {
        fetchInvoices()
        fetchClients()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const client = clients.find(c => c.id === Number(form.client_id))
            const items = form.items.map((it) => ({ ...it, amount: it.quantity * it.rate }))
            const total = items.reduce((s, it) => s + it.amount, 0)

            const payload = {
                invoice_number: form.invoice_number || `INV-${String(invoices.length + 101).padStart(3, '0')}`,
                client_id: form.client_id,
                client_name: client?.name || 'Unknown',
                total_amount: total,
                status: 'pending',
                due_date: form.due_date,
                items
            }

            if (editingId) {
                const { data } = await api.put(`/invoices/${editingId}`, payload)
                setInvoices(invoices.map(i => i.id === editingId ? data : i))
                toast.success('Invoice updated')
            } else {
                const { data } = await api.post('/invoices', payload)
                setInvoices([data, ...invoices])
                toast.success('Invoice created')
            }

            setShowForm(false)
            setEditingId(null)
            setForm({ client_id: '', items: [{ description: '', quantity: 1, rate: 0 }], due_date: '', invoice_number: '' })
        } catch { toast.error('Failed to save invoice') }
    }

    const handleEdit = (inv) => {
        setForm({
            invoice_number: inv.invoice_number,
            client_id: inv.client_id,
            due_date: inv.due_date ? inv.due_date.split('T')[0] : '',
            items: inv.items?.length ? inv.items : [{ description: '', quantity: 1, rate: 0 }]
        })
        setEditingId(inv.id)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this invoice?')) return
        try {
            await api.delete(`/invoices/${id}`)
            setInvoices(invoices.filter(i => i.id !== id))
            toast.success('Deleted')
        } catch { toast.error('Failed to delete') }
    }

    const handleStatusChange = async (id, status) => {
        try {
            await api.patch(`/invoices/${id}/status`, { status })
            setInvoices(invoices.map(i => i.id === id ? { ...i, status } : i))
            toast.success('Status updated')
        } catch (err) {
            console.error('Status update failed:', err)
            toast.error(err.response?.data?.details || err.response?.data?.error || 'Failed to update status')
        }
    }

    const handleApprove = async (id) => {
        try {
            const { data } = await api.patch(`/invoices/${id}/approve`)
            setInvoices(invoices.map(i => i.id === id ? data : i))
            toast.success('Payment approved')
        } catch { toast.error('Failed to approve payment') }
    }

    const handleReject = async (id) => {
        const reason = window.prompt('Enter rejection reason (optional):')
        if (reason === null) return
        try {
            const { data } = await api.patch(`/invoices/${id}/reject`, { reason })
            setInvoices(invoices.map(i => i.id === id ? data : i))
            toast.success('Payment rejected')
        } catch { toast.error('Failed to reject payment') }
    }


    const addItem = () => setForm({ ...form, items: [...form.items, { description: '', quantity: 1, rate: 0 }] })

    const updateItem = (idx, field, value) => {
        const items = [...form.items]
        items[idx] = { ...items[idx], [field]: field === 'description' ? value : Number(value) }
        setForm({ ...form, items })
    }

    const handleView = (inv) => {
        setSelected(inv)
    }

    const statusColors = {
        paid: 'bg-green-100 text-green-700',
        pending: 'bg-amber-100 text-amber-700',
        overdue: 'bg-red-100 text-red-700',
        under_review: 'bg-blue-100 text-blue-700'
    }

    if (loading) return <div className="p-8 text-center">Loading invoices...</div>

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between no-print">
                <p className="text-gray-600 text-sm">{invoices.length} invoices</p>
                <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ client_id: '', items: [{ description: '', quantity: 1, rate: 0 }], due_date: '', invoice_number: '' }) }} className="btn-primary text-sm !py-2 !px-4"><HiOutlinePlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Create Invoice'}</button>
            </div>

            {showForm && (
                <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 no-print">
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase ml-1 mb-1 block">Invoice Number</label>
                            <input required placeholder="e.g. INV-2024-001" value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase ml-1 mb-1 block">Client</label>
                            <select required value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 outline-none">
                                <option value="">Select Client</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase ml-1 mb-1 block">Due Date</label>
                            <input required type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 outline-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Line Items</div>
                        {form.items.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                                <div className="col-span-6">
                                    <input placeholder="Item Description (e.g. Website Design - Phase 1)" value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-blue-500 outline-none" />
                                </div>
                                <div className="col-span-2">
                                    <input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-blue-500 outline-none" />
                                </div>
                                <div className="col-span-3">
                                    <input type="number" min="0" placeholder="Rate (₹)" value={item.rate} onChange={(e) => updateItem(idx, 'rate', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-blue-500 outline-none" />
                                </div>
                                <button type="button" onClick={() => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })} className="col-span-1 p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                    <HiOutlineTrash className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addItem} className="text-blue-600 text-sm font-medium">+ Add Line Item</button>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="btn-primary text-sm !py-2">{editingId ? 'Update Invoice' : 'Create Invoice'}</button>
                        <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} className="btn-secondary text-sm !py-2">Cancel</button>
                    </div>
                </motion.form>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden no-print">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-5 py-3 font-semibold text-gray-700">Invoice #</th>
                                <th className="px-5 py-3 font-semibold text-gray-700">Client</th>
                                <th className="px-5 py-3 font-semibold text-gray-700">Amount</th>
                                <th className="px-5 py-3 font-semibold text-gray-700">Status</th>
                                <th className="px-5 py-3 font-semibold text-gray-700 hidden md:table-cell">Due Date</th>
                                <th className="px-5 py-3 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv, i) => (
                                <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-t border-gray-50 hover:bg-gray-50/50">
                                    <td className="px-5 py-4 font-medium text-gray-900">{inv.invoice_number}</td>
                                    <td className="px-5 py-4 text-gray-600">{inv.client_name}</td>
                                    <td className="px-5 py-4 font-semibold text-gray-900">₹{Number(inv.total_amount).toLocaleString()}</td>
                                    <td className="px-5 py-4">
                                        <select value={inv.status} onChange={(e) => handleStatusChange(inv.id, e.target.value)} className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[inv.status]}`}>
                                            <option value="pending">pending</option>
                                            <option value="under_review">under review</option>
                                            <option value="paid">paid</option>
                                            <option value="overdue">overdue</option>
                                        </select>
                                        {inv.transaction_id && <div className="text-[10px] text-gray-400 mt-1">TXID: {inv.transaction_id}</div>}
                                    </td>
                                    <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '-'}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(inv)} title="Edit" className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><HiOutlinePencilAlt className="w-4 h-4" /></button>
                                            <button onClick={() => setSelected(inv)} title="View" className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><HiOutlineEye className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(inv.id)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
                                        </div>
                                        {inv.status === 'under_review' && (
                                            <div className="flex gap-1 mt-2">
                                                <button onClick={() => handleApprove(inv.id)} className="text-[10px] bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors">Approve</button>
                                                <button onClick={() => handleReject(inv.id)} className="text-[10px] bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors">Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-0 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh] print-section relative" onClick={(e) => e.stopPropagation()}>
                        {/* Watermark Logo (Print Only) */}
                        <img src="/logo.png" className="watermark-logo hidden print:block" alt="" />

                        {/* Digital Header (Screen Only) */}
                        <div className="no-print p-6 bg-gray-50 rounded-t-2xl border-b border-gray-100 flex justify-between items-center">
                            <img src="/logo.png" className="h-16" alt="AppNest" />
                            <div className="text-right">
                                <h2 className="text-xl font-black tracking-tighter text-gray-900">INVOICE</h2>
                                <p className="text-xs text-gray-500 font-bold">#{selected.invoice_number}</p>
                            </div>
                        </div>

                        {/* Print Header (Print Only) */}
                        <div className="hidden print:flex print-header p-8 rounded-t-2xl justify-between items-center">
                            <div>
                                <img src="/logo.png" className="h-10 mb-4 brightness-0 invert" alt="AppNest" />
                                <h2 className="text-4xl font-black tracking-tighter">INVOICE</h2>
                                <p className="opacity-80">#{selected.invoice_number}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-bold text-xl">AppNest Technologies</h3>
                                <p className="text-sm opacity-80">Handwara Jammu & Kashmir</p>
                                <p className="text-sm opacity-80">zahidqureshi1003@gmail.com</p>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-8 pb-8 border-b border-gray-100">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
                                    <h4 className="font-bold text-gray-900 text-lg">{selected.client_name}</h4>
                                    <p className="text-sm text-gray-500">{selected.client_email}</p>
                                </div>
                                <div className="text-right">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Invoice Date</p>
                                            <p className="font-semibold text-gray-900">{new Date(selected.created_at || Date.now()).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Due Date</p>
                                            <p className="font-semibold text-gray-900">{selected.due_date ? new Date(selected.due_date).toLocaleDateString() : 'Upon Receipt'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="print-table-header">
                                        <th className="py-4 px-4 text-left font-bold text-gray-900 rounded-l-lg">Description</th>
                                        <th className="py-4 px-4 text-center font-bold text-gray-900">Qty</th>
                                        <th className="py-4 px-4 text-right font-bold text-gray-900">Rate</th>
                                        <th className="py-4 px-4 text-right font-bold text-gray-900 rounded-r-lg">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {selected.items?.map((it, idx) => (
                                        <tr key={idx}>
                                            <td className="py-5 px-4 text-gray-700 font-medium">{it.description}</td>
                                            <td className="py-5 px-4 text-center text-gray-500">{it.quantity}</td>
                                            <td className="py-5 px-4 text-right text-gray-500">₹{Number(it.rate).toLocaleString()}</td>
                                            <td className="py-5 px-4 text-right font-bold text-gray-900">₹{Number(it.amount).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-end pt-6">
                                <div className="w-72 space-y-3 bg-gray-50 p-6 rounded-2xl">
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Subtotal</span>
                                        <span>₹{Number(selected.total_amount).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-black text-gray-900 pt-3 border-t border-gray-200">
                                        <span>Total</span>
                                        <span className="gradient-text">₹{Number(selected.total_amount).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-gray-900 uppercase">Terms & Conditions</h4>
                                    <p className="text-[10px] text-gray-400 leading-relaxed">
                                        Please pay within the due date to avoid service interruption.
                                        Bank transfers may take 2-3 business days to reflect.
                                        This is a computer generated invoice.
                                    </p>
                                </div>
                                <div className="text-right flex flex-col justify-end">
                                    <p className="text-sm font-bold text-gray-900">Thank you!</p>
                                    <p className="text-xs text-gray-500">AppNest Technologies</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3 no-print">
                            <button onClick={() => window.print()} className="btn-primary flex-1 justify-center">
                                <HiOutlineDownload className="w-4 h-4" /> Print / Download
                            </button>
                            <button onClick={() => setSelected(null)} className="btn-secondary flex-1 justify-center">
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
