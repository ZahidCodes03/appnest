import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineDownload, HiOutlineTrash } from 'react-icons/hi'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function ProposalDownloads() {
    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchLeads = async () => {
        try {
            const { data } = await api.get('/leads')
            setLeads(data)
        } catch (error) {
            toast.error('Failed to fetch leads')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeads()
    }, [])

    const exportCSV = () => {
        const csv = 'Email,Date\n' + leads.map((l) => `${l.email},${l.created_at || l.date}`).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'proposal-leads.csv'
        a.click()
        URL.revokeObjectURL(url)
        toast.success('CSV exported')
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this lead?')) return
        try {
            await api.delete(`/leads/${id}`)
            setLeads(leads.filter((l) => l.id !== id))
            toast.success('Deleted')
        } catch (error) {
            toast.error('Failed to delete lead')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm">{leads.length} emails collected</p>
                <button onClick={exportCSV} className="btn-primary text-sm !py-2 !px-4"><HiOutlineDownload className="w-4 h-4" /> Export CSV</button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-5 py-3 font-semibold text-gray-700">#</th>
                                <th className="px-5 py-3 font-semibold text-gray-700">Email</th>
                                <th className="px-5 py-3 font-semibold text-gray-700">Date</th>
                                <th className="px-5 py-3 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading leads...</td></tr>
                            ) : leads.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-8 text-gray-500">No leads found.</td></tr>
                            ) : leads.map((lead, i) => (
                                <motion.tr key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-t border-gray-50 hover:bg-gray-50/50">
                                    <td className="px-5 py-4 text-gray-500">{i + 1}</td>
                                    <td className="px-5 py-4 font-medium text-gray-900">{lead.email}</td>
                                    <td className="px-5 py-4 text-gray-600">{new Date(lead.created_at || lead.date).toLocaleString()}</td>
                                    <td className="px-5 py-4">
                                        <button onClick={() => handleDelete(lead.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                                            <HiOutlineTrash className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
