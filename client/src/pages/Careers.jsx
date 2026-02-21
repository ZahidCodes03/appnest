import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBriefcase, FiMapPin, FiClock, FiDollarSign, FiUpload, FiSend, FiX, FiCheckCircle, FiUsers } from 'react-icons/fi'
import api from '../lib/api'
import { toast } from 'react-hot-toast'

export default function Careers() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedJob, setSelectedJob] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        resume_url: '',
        portfolio_url: ''
    })

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs')
            setJobs(res.data)
        } catch (err) {
            toast.error('Failed to load job postings')
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const uploadData = new FormData()
        uploadData.append('file', file)

        const toastId = toast.loading('Uploading resume...')
        try {
            const res = await api.post('/upload', uploadData)
            setFormData({ ...formData, resume_url: res.data.url })
            toast.success('Resume uploaded successfully!', { id: toastId })
        } catch (err) {
            toast.error('Upload failed. Please try again.', { id: toastId })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.resume_url) return toast.error('Please upload your resume')

        setSubmitting(true)
        try {
            await api.post('/applications', { ...formData, job_id: selectedJob?.id || null })
            toast.success('Application submitted successfully!')
            setSelectedJob(null)
            setFormData({ full_name: '', email: '', phone: '', resume_url: '', portfolio_url: '' })
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to submit application')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#0f172a]">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium"
                >
                    Join the Mission
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-6"
                >
                    Build the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Software</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-400 text-lg max-w-2xl mx-auto"
                >
                    We're looking for passionate individuals who love clean code, stunning design, and solving complex problems.
                </motion.p>
            </div>

            {/* Jobs List */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="space-y-6">
                        {jobs.map((job, idx) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/50 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium">
                                                {job.category}
                                            </span>
                                            <span className="text-slate-500 text-sm">•</span>
                                            <span className="text-slate-400 text-sm">{job.type}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <FiMapPin className="text-indigo-400" />
                                                {job.location}
                                            </div>
                                            {job.salary_range && (
                                                <div className="flex items-center gap-1.5">
                                                    <FiDollarSign className="text-indigo-400" />
                                                    {job.salary_range}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <FiUsers className="text-indigo-400" />
                                                {job.vacancy_count || 1} {(job.vacancy_count || 1) === 1 ? 'Vacancy' : 'Vacancies'}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedJob(job)}
                                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95 whitespace-nowrap"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-slate-700/50">
                        <FiBriefcase className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                        <h3 className="text-white text-lg font-medium">No open positions right now</h3>
                        <p className="text-slate-500 mt-2">But we're always happy to hear from talented people!</p>
                        <button
                            onClick={() => setSelectedJob({ title: 'General Application' })}
                            className="mt-6 text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
                        >
                            Send a general application →
                        </button>
                    </div>
                )}
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedJob(null)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 md:p-8 flex justify-between items-start border-b border-slate-800">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Applying for {selectedJob.title}</h2>
                                    <p className="text-slate-400 text-sm">Tell us why you're a great fit for AppNest.</p>
                                </div>
                                <button onClick={() => setSelectedJob(null)} className="p-2 text-slate-400 hover:text-white transition-colors">
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh]">
                                {/* Job Details Summary */}
                                {selectedJob.description && (
                                    <div className="mb-8 p-5 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                            <FiBriefcase className="text-indigo-400" /> Job Overview
                                        </h4>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                                            {selectedJob.description}
                                        </p>

                                        {selectedJob.requirements && (
                                            <>
                                                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                                    <FiCheckCircle className="text-indigo-400" /> Key Requirements
                                                </h4>
                                                <ul className="space-y-2">
                                                    {selectedJob.requirements.split('\n').filter(r => r.trim()).map((req, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-slate-400 text-sm">
                                                            <span className="text-indigo-500 mt-1">•</span>
                                                            {req.trim()}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Portfolio/LinkedIn URL</label>
                                            <input
                                                type="url"
                                                value={formData.portfolio_url}
                                                onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                                placeholder="https://behance.net/johndoe"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5 italic">Resume (Required)</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-slate-800/50 transition-all">
                                                <FiUpload className="text-indigo-400" />
                                                <span className="text-slate-400 text-sm">
                                                    {formData.resume_url ? 'Resume Attached ✅' : 'Click to upload PDF/DOCX'}
                                                </span>
                                                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                                            </label>
                                            {formData.resume_url && (
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, resume_url: '' })}
                                                    className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                                                >
                                                    <FiX />
                                                </button>
                                            )}
                                        </div>
                                    </div>


                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Submitting Application...
                                            </>
                                        ) : (
                                            <>
                                                <FiSend />
                                                Submit Application
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
