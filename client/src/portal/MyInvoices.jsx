import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineDownload, HiOutlineCreditCard, HiOutlineCheckCircle, HiOutlineEye } from 'react-icons/hi'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function MyInvoices() {
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const { data } = await api.get('/invoices/mine')
                setInvoices(data)
            } catch { toast.error('Failed to fetch invoices') }
            finally { setLoading(false) }
        }
        fetchInvoices()
    }, [])

    const [showPayment, setShowPayment] = useState(null)
    const [selected, setSelected] = useState(null)
    const [paymentSuccess, setPaymentSuccess] = useState(false)

    // Polling for payment status
    useEffect(() => {
        let interval;
        if (showPayment && showPayment.status === 'pending' && !paymentSuccess) {
            interval = setInterval(async () => {
                try {
                    const { data } = await api.get(`/invoices/${showPayment.id}/status`)
                    if (data.status === 'under_review') {
                        setInvoices(prev => prev.map(inv => inv.id === showPayment.id ? { ...inv, status: 'under_review' } : inv))
                        setShowPayment(prev => ({ ...prev, status: 'under_review' }))
                    }
                    if (data.status === 'paid') {
                        setPaymentSuccess(true)
                        setInvoices(prev => prev.map(inv => inv.id === showPayment.id ? { ...inv, status: 'paid' } : inv))
                        // Clear interval immediately
                        clearInterval(interval)
                        // Auto close after showing animation
                        setTimeout(() => {
                            setShowPayment(null)
                            setPaymentSuccess(false)
                        }, 3000)
                    }
                } catch (err) {
                    console.error('Polling failed', err)
                }
            }, 3000) // Poll every 3 seconds
        }
        return () => clearInterval(interval)
    }, [showPayment, paymentSuccess])

    const handlePayClick = (inv) => {
        setShowPayment(inv)
        setPaymentSuccess(false)
        setTxId('')
    }

    const [txId, setTxId] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmitPayment = async (e) => {
        e.preventDefault()
        if (!txId) return toast.error('Please enter Transaction ID')
        setSubmitting(true)
        try {
            await api.post(`/invoices/${showPayment.id}/pay`, { transaction_id: txId })
            toast.success('Payment submitted for review')
            setInvoices(prev => prev.map(inv => inv.id === showPayment.id ? { ...inv, status: 'under_review' } : inv))
            setShowPayment(prev => ({ ...prev, status: 'under_review' }))
        } catch {
            toast.error('Failed to submit payment')
        } finally {
            setSubmitting(false)
        }
    }

    const handleView = (inv) => {
        setSelected(inv)
    }

    if (loading) return <div className="text-center p-8">Loading invoices...</div>
    if (invoices.length === 0) return <div className="text-center p-8 text-gray-500">No invoices found.</div>

    return (
        <div className="space-y-4">
            {invoices.map((inv, i) => (
                <motion.div key={inv.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900">{inv.invoice_number}</h3>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                                    inv.status === 'under_review' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700'}`}>{inv.status.replace('_', ' ')}</span>
                            </div>
                            <p className="text-sm text-gray-500">{inv.client_name} • {new Date(inv.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-extrabold gradient-text">₹{Number(inv.total_amount).toLocaleString()}</span>
                            <button onClick={() => handleView(inv)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 no-print" title="View Invoice">
                                <HiOutlineEye className="w-5 h-5" />
                            </button>
                            {inv.status === 'pending' && (
                                <button onClick={() => handlePayClick(inv)} className="btn-primary text-sm !py-2 !px-4 no-print">
                                    <HiOutlineCreditCard className="w-4 h-4" /> Pay Now
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
            {/* Payment Modal */}
            <AnimatePresence>
                {showPayment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 no-print" onClick={() => !paymentSuccess && setShowPayment(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 overflow-hidden relative">
                            {paymentSuccess ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center space-y-4">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <HiOutlineCheckCircle className="w-16 h-16 text-green-600" />
                                    </motion.div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
                                        <p className="text-gray-500">Your invoice has been marked as paid.</p>
                                    </div>
                                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3 }} className="h-1 bg-green-500 absolute bottom-0 left-0" />
                                </motion.div>
                            ) : (
                                <>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-gray-900">Scan & Pay</h3>
                                        <p className="text-sm text-gray-500">Invoice #{showPayment.invoice_number}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4 text-center space-y-4">
                                        <div className="mx-auto w-48 h-48 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center relative group">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                                                    `upi://pay?pa=zahidqureshi1003@okaxis&pn=AppNest&am=${Number(showPayment.total_amount).toFixed(2)}&cu=INR&tn=Invoice ${showPayment.invoice_number}&tr=${showPayment.id}`
                                                )}`}
                                                alt="Payment QR"
                                                className="w-full h-full object-contain"
                                            />
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-gray-700">Scan via Any UPI App</p>
                                            <p className="text-xs text-gray-400">GPay, PhonePe, Paytm, etc.</p>
                                        </div>
                                        <div className="text-2xl font-black text-gray-900 tracking-tight">₹{Number(showPayment.total_amount).toLocaleString()}</div>
                                    </div>

                                    {showPayment.status === 'under_review' ? (
                                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center space-y-2">
                                            <div className="flex justify-center">
                                                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                                                    <HiOutlineCheckCircle className="w-6 h-6 text-blue-600" />
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-blue-900">Payment Under Review</h4>
                                            <p className="text-xs text-blue-600">We've received your payment details. Admin will verify and approve it shortly.</p>
                                            <button onClick={() => setShowPayment(null)} className="btn-secondary w-full text-sm mt-2">Close</button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmitPayment} className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Transaction ID / UTR</label>
                                                <input
                                                    type="text"
                                                    value={txId}
                                                    onChange={e => setTxId(e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                                    placeholder="Enter transaction ID after paying"
                                                    required
                                                />
                                            </div>
                                            <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
                                                {submitting ? 'Submitting...' : <><HiOutlineCheckCircle className="w-4 h-4" /> I've Paid - Submit for Review</>}
                                            </button>
                                            <button type="button" onClick={() => setShowPayment(null)} className="w-full py-2.5 text-gray-500 font-medium text-sm hover:bg-gray-50 rounded-xl transition-colors">
                                                Cancel
                                            </button>
                                        </form>
                                    )}
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
