import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiBriefcase, FiMapPin, FiClock, FiX, FiCheck, FiUsers } from 'react-icons/fi'
import api from '../lib/api'
import { toast } from 'react-hot-toast'

export default function AdminJobs() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingJob, setEditingJob] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        category: 'Development',
        type: 'Full-time',
        location: 'Remote',
        description: '',
        requirements: '',
        salary_range: '',
        vacancy_count: 1,
        status: 'active'
    })

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs/all')
            setJobs(res.data)
        } catch (err) {
            toast.error('Failed to fetch jobs')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingJob) {
                await api.put(`/jobs/${editingJob.id}`, formData)
                toast.success('Job updated successfully')
            } else {
                await api.post('/jobs', formData)
                toast.success('Job posted successfully')
            }
            fetchJobs()
            setIsModalOpen(false)
            resetForm()
        } catch (err) {
            toast.error('Operation failed')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) return
        try {
            await api.delete(`/jobs/${id}`)
            toast.success('Job deleted')
            fetchJobs()
        } catch (err) {
            toast.error('Failed to delete')
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            category: 'Development',
            type: 'Full-time',
            location: 'Remote',
            description: '',
            requirements: '',
            salary_range: '',
            vacancy_count: 1,
            status: 'active'
        })
        setEditingJob(null)
    }

    const openEdit = (job) => {
        setEditingJob(job)
        setFormData(job)
        setIsModalOpen(true)
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
                    <p className="text-gray-500">Manage career opportunities at AppNest</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                    <FiPlus /> Post New Job
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {jobs.map((job) => (
                        <div key={job.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${job.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {job.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1"><FiBriefcase className="text-indigo-600" /> {job.category}</div>
                                    <div className="flex items-center gap-1"><FiMapPin className="text-indigo-600" /> {job.location}</div>
                                    <div className="flex items-center gap-1"><FiClock className="text-indigo-600" /> {job.type}</div>
                                    <div className="flex items-center gap-1"><FiUsers className="text-indigo-600" /> {job.vacancy_count || 1} {(job.vacancy_count || 1) === 1 ? 'Vacancy' : 'Vacancies'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openEdit(job)}
                                    className="p-2 bg-gray-50 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                    <FiEdit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(job.id)}
                                    className="p-2 bg-gray-50 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {jobs.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-50 text-gray-400">
                            No job postings found.
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{editingJob ? 'Edit Job' : 'Post New Job'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900"><FiX size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title</label>
                                        <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 focus:border-indigo-500 outline-none" placeholder="e.g., Senior Frontend Developer" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 focus:border-indigo-500 outline-none">
                                            <option>Development</option>
                                            <option>Design</option>
                                            <option>Marketing</option>
                                            <option>Sales</option>
                                            <option>Management</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label>
                                        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 focus:border-indigo-500 outline-none">
                                            <option>Full-time</option>
                                            <option>Part-time</option>
                                            <option>Contract</option>
                                            <option>Internship</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                                        <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 focus:border-indigo-500 outline-none" placeholder="e.g., Remote / New York" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary Range</label>
                                        <input type="text" value={formData.salary_range} onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 focus:border-indigo-500 outline-none" placeholder="e.g., $80k - $120k / yr" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Vacancies</label>
                                        <input type="number" min="1" value={formData.vacancy_count || 1} onChange={(e) => setFormData({ ...formData, vacancy_count: parseInt(e.target.value) || 1 })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 focus:border-indigo-500 outline-none" placeholder="e.g., 3" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                                    <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 focus:border-indigo-500 outline-none resize-none" placeholder="Detailed job description..." />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Requirements (one per line)</label>
                                    <textarea rows={4} value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 focus:border-indigo-500 outline-none resize-none" placeholder="e.g., 3+ years React experience..." />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                                    <div className="flex gap-4">
                                        {['active', 'closed'].map(s => (
                                            <button key={s} type="button" onClick={() => setFormData({ ...formData, status: s })} className={`px-4 py-2 rounded-xl border transition-all ${formData.status === s ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-200 text-gray-500'}`}>
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                                >
                                    {editingJob ? 'Update Job Posting' : 'Post Job Now'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
