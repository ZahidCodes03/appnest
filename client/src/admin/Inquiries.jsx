import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineTrash, HiOutlineReply, HiOutlineEye } from 'react-icons/hi'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Inquiries() {
    const [inquiries, setInquiries] = useState([])
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchInquiries = async () => {
        try {
            const { data } = await api.get('/inquiries')
            setInquiries(data)
        } catch (error) {
            toast.error('Failed to fetch inquiries')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInquiries()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this inquiry?')) return
        try {
            await api.delete(`/inquiries/${id}`)
            setInquiries(inquiries.filter((i) => i.id !== id))
            toast.success('Inquiry deleted')
        } catch (error) {
            toast.error('Failed to delete inquiry')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm">{inquiries.length} inquiries</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-5 py-3 font-semibold text-gray-700">Name</th>
                                <th className="px-5 py-3 font-semibold text-gray-700 hidden md:table-cell">Project</th>
                                <th className="px-5 py-3 font-semibold text-gray-700 hidden lg:table-cell">Budget</th>
                                <th className="px-5 py-3 font-semibold text-gray-700">Status</th>
                                <th className="px-5 py-3 font-semibold text-gray-700 hidden md:table-cell">Date</th>
                                <th className="px-5 py-3 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading inquiries...</td></tr>
                            ) : inquiries.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No inquiries found.</td></tr>
                            ) : inquiries.map((inq, i) => (
                                <motion.tr key={inq.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-t border-gray-50 hover:bg-gray-50/50">
                                    <td className="px-5 py-4">
                                        <div className="font-medium text-gray-900">{inq.name}</div>
                                        <div className="text-gray-500 text-xs">{inq.email}</div>
                                    </td>
                                    <td className="px-5 py-4 text-gray-600 hidden md:table-cell">{inq.project_type}</td>
                                    <td className="px-5 py-4 text-gray-600 hidden lg:table-cell">{inq.budget}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${inq.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {inq.status || 'new'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{new Date(inq.created_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setSelected(inq)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><HiOutlineEye className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(inq.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Inquiry Details</h3>
                        <div className="space-y-3 text-sm">
                            <div><span className="font-medium text-gray-700">Name:</span> {selected.name}</div>
                            <div><span className="font-medium text-gray-700">Email:</span> {selected.email}</div>
                            <div><span className="font-medium text-gray-700">Phone:</span> {selected.phone}</div>
                            <div><span className="font-medium text-gray-700">Project:</span> {selected.project_type}</div>
                            <div><span className="font-medium text-gray-700">Budget:</span> {selected.budget}</div>
                            <div><span className="font-medium text-gray-700">Deadline:</span> {selected.deadline}</div>
                            <div><span className="font-medium text-gray-700">Message:</span> {selected.message}</div>
                        </div>
                        <button onClick={() => setSelected(null)} className="btn-primary mt-6 w-full justify-center">Close</button>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
