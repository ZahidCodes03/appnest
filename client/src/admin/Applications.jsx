import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiFileText, FiLink, FiMail, FiPhone, FiTrash2, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import api from '../lib/api'
import { toast } from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function AdminApplications() {
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchApps()
    }, [])

    const fetchApps = async () => {
        try {
            const res = await api.get('/applications')
            setApps(res.data)
        } catch (err) {
            toast.error('Failed to load applications')
        } finally {
            setLoading(false)
        }
    }

    const notifyWhatsApp = (app) => {
        if (!app.phone) return toast.error('Candidate has no phone number listed')

        const cleanPhone = app.phone.replace(/\D/g, '')
        const statusMap = {
            pending: 'is pending review',
            reviewing: 'is currently being reviewed',
            accepted: 'has been accepted! Congratulations! We will contact you soon for the next steps',
            rejected: 'has been reviewed and we are not moving forward at this time'
        }

        const message = `Hi ${app.full_name}, this is AppNest Technologies. We are reaching out regarding your application for the position. Your application status ${statusMap[app.status] || 'has been updated'}. Best regards, Team AppNest.`

        const url = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
    }

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/applications/${id}/status`, { status })
            toast.success(`Application marked as ${status}`)
            fetchApps()
        } catch (err) {
            toast.error('Failed to update status')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this application record?')) return
        try {
            await api.delete(`/applications/${id}`)
            toast.success('Application deleted')
            fetchApps()
        } catch (err) {
            toast.error('Deletion failed')
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-500'
            case 'reviewing': return 'bg-blue-500/10 text-blue-500'
            case 'accepted': return 'bg-green-500/10 text-green-500'
            case 'rejected': return 'bg-red-500/10 text-red-500'
            default: return 'bg-slate-500/10 text-slate-500'
        }
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
                <p className="text-gray-500">Review and manage candidate submissions</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {apps.map((app) => (
                        <div key={app.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 border-b border-gray-50 pb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-bold text-gray-900">{app.full_name}</h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <p className="text-indigo-400 font-medium text-sm">
                                            Applied for: {app.job_title || 'General Application'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => notifyWhatsApp(app)}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-bold transition-all"
                                            title="Notify via WhatsApp"
                                        >
                                            <FaWhatsapp /> Notify
                                        </button>
                                        <div className="h-4 w-px bg-gray-100 mx-1" />
                                        <select
                                            value={app.status}
                                            onChange={(e) => updateStatus(app.id, e.target.value)}
                                            className="bg-gray-50 border border-gray-200 text-gray-900 px-3 py-1.5 rounded-lg text-sm outline-none focus:border-indigo-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="reviewing">Reviewing</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        <button onClick={() => handleDelete(app.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Contact Details</span>
                                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                                            <FiMail className="text-gray-400" /> {app.email}
                                        </div>
                                        {app.phone && (
                                            <div className="flex items-center gap-2 text-gray-700 text-sm">
                                                <FiPhone className="text-gray-400" /> {app.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Materials</span>
                                        <a
                                            href={`${API_URL}${app.resume_url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium transition-colors text-sm"
                                        >
                                            <FiFileText /> View Resume
                                        </a>
                                        {app.portfolio_url && (
                                            <a
                                                href={app.portfolio_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium transition-colors text-sm"
                                            >
                                                <FiLink /> Portfolio/Other Link
                                            </a>
                                        )}
                                    </div>

                                </div>
                            </div>
                            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                                <span>Candidate ID: APP-{app.id.toString().padStart(4, '0')}</span>
                                <div className="flex items-center gap-1">
                                    <FiClock /> Applied on {new Date(app.applied_at).toLocaleDateString()} at {new Date(app.applied_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {apps.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-50 text-gray-400 font-medium">
                            No applications received yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
